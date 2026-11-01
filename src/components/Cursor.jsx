import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import useMediaQuery from '../hooks/useMediaQuery';

/**
 * Custom cursor, desktop only (fine pointer + hover).
 *
 * Elements opt into a state with data attributes:
 *   data-cursor="label" data-cursor-label="Click"  → grows into a labelled disc
 *   data-cursor="hide"                              → hides (e.g. text fields)
 * Regions on a dark ground set data-theme="ink" so the dot turns white.
 * Links and buttons shrink it to a small ring.
 *
 * Uses gsap.quickTo instead of creating a new tween on every mousemove.
 */
export default function Cursor() {
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine)');
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = dot.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    let shown = false;

    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-visible');
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const over = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const stateEl = target.closest('[data-cursor]');
      const interactive = target.closest('a, button, [role="slider"], [role="radio"]');
      const ink = target.closest('[data-theme="ink"]');
      const state = stateEl?.dataset.cursor ?? (interactive ? 'link' : 'default');
      el.dataset.state = state;
      el.dataset.theme = ink ? 'ink' : 'paper';
      label.current.textContent = state === 'label' ? stateEl.dataset.cursorLabel ?? '' : '';
    };

    // labels can change on click (Flood → Drain): re-read after React updates
    const click = (e) => requestAnimationFrame(() => over(e));

    const leave = () => el.classList.remove('is-visible');
    const enter = () => shown && el.classList.add('is-visible');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('click', click);
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('click', click);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={dot} className="cursor" data-state="default" aria-hidden="true">
      <span className="cursor__disc" />
      <span ref={label} className="cursor__label" />
    </div>
  );
}
