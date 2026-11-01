import { useEffect, useImperativeHandle, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { readyFrame, requestSequence } from '../lib/frames';
import { isCoarsePointer, prefersReducedMotion } from '../lib/env';

/**
 * Draws one pepper image sequence onto a <canvas>.
 *
 * Replaces the original Canvas.jsx, which re-rendered React 60 times a second
 * and created a new Image() every frame. This version:
 * - loads frames once through a shared cache (lib/frames.js)
 * - animates on GSAP's ticker with no React state
 * - stops when off screen (IntersectionObserver) or when `active` is false
 * - sizes its backing store from the element (ResizeObserver, DPR capped)
 * - plays every other frame on touch devices and holds one frame under
 *   prefers-reduced-motion
 *
 * The `ref` handle lets a parent scrub frames, swap sequence or change speed.
 */
export default function SequenceCanvas({
  start = 0,
  count = 150,
  duration = 3,
  active = true,
  className = '',
  ref,
}) {
  const canvasRef = useRef(null);
  const state = useRef({
    start,
    count,
    duration,
    progress: 0,
    frame: 0,
    speed: 1,
    mode: 'loop',
    drawn: -1,
    visible: false,
    active,
    step: 1,
    reduced: false,
    requested: false,
  });

  // Imperative API (used by the camera pepper and the playground).
  useImperativeHandle(
    ref,
    () => ({
      setFrame(frame) {
        const s = state.current;
        s.mode = 'manual';
        s.frame = ((Math.round(frame) % s.count) + s.count) % s.count;
        s.progress = s.frame / s.count;
        draw();
      },
      getFrame: () => state.current.frame,
      getCount: () => state.current.count,
      setMode(mode) {
        state.current.mode = mode;
      },
      getMode: () => state.current.mode,
      setSpeed(speed) {
        gsap.to(state.current, { speed, duration: 0.6, ease: 'power2.out', overwrite: true });
      },
      setSequence(nextStart, nextCount = 150) {
        const s = state.current;
        s.start = nextStart;
        s.count = nextCount;
        s.requested = false;
        s.drawn = -1;
        ensureFrames();
        draw();
      },
    }),
    // draw and ensureFrames only touch refs, so the handle can stay stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function ensureFrames() {
    const s = state.current;
    if (s.requested || !s.active || !s.visible) return;
    s.requested = true;
    // reduced motion holds a single frame, so only that frame is fetched
    requestSequence(s.start, s.reduced ? 1 : s.count, s.step, () => {
      s.drawn = -1;
      draw();
    });
  }

  function draw() {
    const canvas = canvasRef.current;
    const s = state.current;
    if (!canvas || !s.requested) return;
    // Fall back to the nearest earlier frame that has loaded.
    let index = s.frame - (s.frame % s.step);
    let img = null;
    for (let i = 0; i < s.count && !img; i += s.step) {
      const candidate = (index - i + s.count) % s.count;
      img = readyFrame(s.start + candidate);
      if (img) index = candidate;
    }
    if (!img) return;
    const key = s.start + index;
    if (key === s.drawn) return;
    s.drawn = key;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
  }

  useEffect(() => {
    const s = state.current;
    s.active = active;
    s.duration = duration;
    if (active) ensureFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const s = state.current;
    s.reduced = prefersReducedMotion();
    s.step = isCoarsePointer() ? 2 : 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isCoarsePointer() ? 1.5 : 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        s.drawn = -1;
        draw();
      }
    };

    const tick = (_time, deltaMs) => {
      if (!s.active || !s.visible) return;
      if (s.mode === 'loop' && !s.reduced) {
        s.progress = (s.progress + (deltaMs / 1000 / s.duration) * s.speed) % 1;
        s.frame = Math.floor(s.progress * s.count);
      }
      draw();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
        if (s.visible) {
          ensureFrames();
          draw();
        }
      },
      { rootMargin: '25% 0px' }
    );
    const ro = new ResizeObserver(resize);

    resize();
    io.observe(canvas);
    ro.observe(canvas);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={`seq-canvas ${className}`} aria-hidden="true" />;
}
