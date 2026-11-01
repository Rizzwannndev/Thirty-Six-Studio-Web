import { useRef } from 'react';
import { gsap, useGSAP, EASE } from '../lib/gsap';
import { useSite } from '../context/site';

/**
 * The white → red transformation.
 *
 * A fixed red layer sits behind all content. Clicking the wordmark grows a
 * circular clip-path from the exact click point until it covers the farthest
 * corner of the viewport. Once it is covered, <html> gets `is-flooded` and the
 * page ground itself turns red, so scrolling content stays red everywhere.
 * Draining reverses it: the ground turns white under a full red layer, which
 * then contracts to the new click point.
 *
 * Replaces the original setTimeout + body-colour swap, which could not be
 * reversed smoothly.
 */
export default function FloodLayer() {
  const { flooded, floodOrigin, reducedMotion } = useSite();
  const layer = useRef(null);
  const previous = useRef(false);

  useGSAP(
    () => {
      const el = layer.current;
      const root = document.documentElement;
      // Only animate on a real change (also guards StrictMode's double effect).
      if (previous.current === flooded) {
        if (!flooded) gsap.set(el, { clipPath: 'circle(0px at 50% 50%)' });
        return;
      }
      previous.current = flooded;
      const { x, y } = floodOrigin.current;
      const radius =
        Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 4;
      const closed = `circle(0px at ${x}px ${y}px)`;
      const open = `circle(${radius}px at ${x}px ${y}px)`;

      if (reducedMotion) {
        gsap.set(el, { clipPath: 'none' });
        gsap.fromTo(
          el,
          { opacity: flooded ? 0 : 1 },
          {
            opacity: flooded ? 1 : 0,
            duration: 0.35,
            ease: 'none',
            onStart: () => !flooded && root.classList.remove('is-flooded'),
            onComplete: () => flooded && root.classList.add('is-flooded'),
          }
        );
        return;
      }

      gsap.set(el, { opacity: 1 });
      if (flooded) {
        gsap.fromTo(
          el,
          { clipPath: closed },
          {
            clipPath: open,
            duration: 1.25,
            ease: EASE.scene,
            onComplete: () => root.classList.add('is-flooded'),
          }
        );
      } else {
        root.classList.remove('is-flooded');
        gsap.fromTo(el, { clipPath: open }, { clipPath: closed, duration: 1.1, ease: EASE.scene });
      }
    },
    { dependencies: [flooded] }
  );

  return <div ref={layer} className="flood" aria-hidden="true" />;
}
