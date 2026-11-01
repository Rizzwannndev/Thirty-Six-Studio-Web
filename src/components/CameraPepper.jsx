import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { camera } from '../lib/camera';
import { SEQUENCES } from '../lib/frames';
import SequenceCanvas from './SequenceCanvas';

const BASE = 480; // px size of the canvas box; scale is applied with transforms
const ease = gsap.parseEase('power2.inOut');

/**
 * The travelling pepper.
 *
 * Every section marks where the pepper should sit with an element carrying
 * `data-camera-anchor` (its box is the pepper's box). This component keeps a
 * single fixed canvas and, on every tick, places it between the two anchors
 * that bracket the current scroll position. From an anchor's start (anchor
 * centred in the viewport) to its end, the pepper sits exactly on that anchor
 * and scrolls with it; between anchors it glides from one to the next.
 *
 * An anchor's end equals its start unless it holds: anchors inside a pinned
 * section hold for the pin distance (measured from their .pin-spacer), and
 * `data-camera-hold="<selector>"` holds until that ancestor scrolls out (or,
 * when the column is not sticky, until the anchor reaches the viewport top).
 */
export default function CameraPepper() {
  const boxRef = useRef(null);
  const canvasApi = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    camera.api = canvasApi.current;
    const box = boxRef.current;
    let anchors = [];
    let lastLive = false;

    const docTop = (el) => {
      const spacer = el.closest('.pin-spacer');
      if (spacer) {
        const pinned = spacer.firstElementChild;
        return (
          spacer.getBoundingClientRect().top +
          window.scrollY +
          (el.getBoundingClientRect().top - pinned.getBoundingClientRect().top)
        );
      }
      return el.getBoundingClientRect().top + window.scrollY;
    };

    // only hold while some ancestor below the container is actually sticky
    // (the sticky columns collapse to static on small screens)
    const isStuck = (el, container) => {
      for (let n = el.parentElement; n && n !== container; n = n.parentElement) {
        if (getComputedStyle(n).position === 'sticky') return true;
      }
      return false;
    };

    const measure = () => {
      const vh = window.innerHeight;
      anchors = [...document.querySelectorAll('[data-camera-anchor]')]
        .filter((el) => el.offsetWidth > 0)
        .map((el) => {
          const start = docTop(el) + el.offsetHeight / 2 - vh / 2;
          let end = start;
          // inside a pinned section: hold for the whole pin distance
          const spacer = el.closest('.pin-spacer');
          if (spacer) end = start + (spacer.offsetHeight - spacer.firstElementChild.offsetHeight);
          // inside a sticky column: hold until the container scrolls away
          const hold = el.dataset.cameraHold && el.closest(el.dataset.cameraHold);
          if (hold && isStuck(el, hold)) end = hold.getBoundingClientRect().bottom + window.scrollY - vh;
          // not stuck (phones): stay parked until the anchor reaches the top edge,
          // so the pepper never drifts over the copy beside its parking spot
          else if (hold) end = docTop(el);
          return { el, start, end: Math.max(start, end), hero: el.hasAttribute('data-camera-hero') };
        })
        .sort((a, b) => a.start - b.start);
    };

    const tick = () => {
      if (!anchors.length) return;
      const s = window.scrollY;
      let i = 0;
      while (i < anchors.length - 1 && s >= anchors[i + 1].start) i += 1;
      const a = anchors[i];
      const b = anchors[Math.min(i + 1, anchors.length - 1)];
      const span = b.start - a.end;
      const t = span > 0 ? ease(gsap.utils.clamp(0, 1, (s - a.end) / span)) : 0;

      const ra = a.el.getBoundingClientRect();
      const rb = b.el.getBoundingClientRect();
      const reveal = camera.heroReveal.value;
      const opA = a.hero ? reveal : 1;
      const opB = b.hero ? reveal : 1;
      const grow = (anchor) => (anchor.hero ? 0.35 + 0.65 * reveal : 1);

      const x = ra.left + (rb.left - ra.left) * t;
      const y = ra.top + (rb.top - ra.top) * t;
      const size = ra.width * grow(a) + (rb.width * grow(b) - ra.width * grow(a)) * t;
      const width = ra.width + (rb.width - ra.width) * t;
      const opacity = opA + (opB - opA) * t;
      // keep the pepper centred on the interpolated box while it grows
      const offset = (width - size) / 2;

      box.style.transform = `translate3d(${x + offset}px, ${y + offset}px, 0) scale(${size / BASE})`;
      box.style.opacity = opacity.toFixed(3);

      const isLive = opacity > 0.01 && y < window.innerHeight && y + size > 0;
      if (isLive !== lastLive) {
        lastLive = isLive;
        setLive(isLive);
      }
    };

    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    window.addEventListener('resize', measure);
    gsap.ticker.add(tick);

    return () => {
      ScrollTrigger.removeEventListener('refresh', measure);
      window.removeEventListener('resize', measure);
      gsap.ticker.remove(tick);
      camera.api = null;
    };
  }, []);

  const seq = SEQUENCES[4];
  return (
    <div className="camera" aria-hidden="true">
      <div ref={boxRef} className="camera__box" style={{ width: BASE, height: BASE }}>
        <SequenceCanvas ref={canvasApi} start={seq.start} count={seq.count} duration={3.4} active={live} />
      </div>
    </div>
  );
}
