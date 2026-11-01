import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap, SplitText, useGSAP, EASE } from '../lib/gsap';
import { camera } from '../lib/camera';
import { useSite } from '../context/site';
import useMediaQuery from '../hooks/useMediaQuery';
import SequenceCanvas from '../components/SequenceCanvas';
import data from '../data';
import { HERO } from '../content';

// data[0] is the original hero layout. Slot 4 (the large pepper on the right)
// becomes the camera pepper's starting box. On phones only a few are kept.
const CAMERA_SLOT = 4;
const MOBILE_SLOTS = [0, 1, 3];
// keep the desktop scatter clear of the intro headline
const DESKTOP_OVERRIDES = { 3: { top: 3, left: 80 } };
const PARALLAX = [0.12, -0.08, 0.18, 0.06, 0, -0.14, 0.1, -0.05, 0.16];

/** Fit each wordmark line to the container width. */
function useFitText(container, deps) {
  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const range = document.createRange();
    const fit = () => {
      const target = el.clientWidth;
      if (!target) return;
      el.querySelectorAll('.wordmark__line').forEach((line) => {
        // two passes: measure the rendered text, scale, then correct
        for (let pass = 0; pass < 2; pass += 1) {
          range.selectNodeContents(line);
          const width = range.getBoundingClientRect().width;
          const size = parseFloat(getComputedStyle(line).fontSize);
          if (width > 0 && size > 0) line.style.fontSize = `${(size * target) / width}px`;
        }
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Hero() {
  const { flooded, toggleFlood, floodOrigin, reducedMotion } = useSite();
  const isPhone = useMediaQuery('(max-width: 639px)');
  const root = useRef(null);
  const wordmark = useRef(null);
  const chars = useRef([]);
  const lastFlooded = useRef(flooded);

  const lines = isPhone ? ['Thirtysix', 'studios'] : ['Thirtysixstudios'];
  const swarm = useMemo(
    () =>
      data[0]
        .map((d, i) => ({ ...d, ...(!isPhone && DESKTOP_OVERRIDES[i]), slot: i }))
        .filter((d) => d.slot !== CAMERA_SLOT && (!isPhone || MOBILE_SLOTS.includes(d.slot))),
    [isPhone]
  );
  const cameraBox = data[0][CAMERA_SLOT];

  useFitText(wordmark, [isPhone]);

  // Opening sequence: the wordmark rises out of its baseline mask, then the
  // intro copy settles. The page's one orchestrated load moment.
  useGSAP(
    () => {
      const split = SplitText.create(wordmark.current.querySelectorAll('.wordmark__line'), {
        type: 'chars',
        mask: 'chars',
        charsClass: 'wordmark__char',
      });
      chars.current = split.chars;
      if (reducedMotion) return;
      gsap.from(split.chars, { yPercent: 105, duration: 1.6, stagger: 0.035, ease: EASE.arrive, delay: 0.2 });
      gsap.from('.hero__intro > *', { y: 28, opacity: 0, duration: 1.2, stagger: 0.1, delay: 0.75 });
    },
    { scope: root, dependencies: [isPhone], revertOnUpdate: true }
  );

  // Flood choreography: the swarm grows out of the click point (nearest
  // peppers first), the wordmark ripples outward from the clicked letter,
  // and the camera pepper takes its place in the swarm.
  useGSAP(
    () => {
      if (lastFlooded.current === flooded) return;
      lastFlooded.current = flooded;
      const { x, y } = floodOrigin.current;
      const items = gsap.utils.toArray('.swarm__item', root.current);
      const far = Math.hypot(window.innerWidth, window.innerHeight);
      const delayFor = (el) => {
        const r = el.getBoundingClientRect();
        return Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y) / far;
      };

      if (reducedMotion) {
        gsap.to(items, { opacity: flooded ? 1 : 0, scale: 1, duration: 0.3, overwrite: true });
        gsap.to(camera.heroReveal, { value: flooded ? 1 : 0, duration: 0.3, overwrite: true });
        return;
      }

      if (flooded) {
        items.forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0, opacity: 0, rotate: gsap.utils.random(-25, 25) },
            { scale: 1, opacity: 1, rotate: 0, duration: 1.3, ease: EASE.arrive, delay: 0.2 + delayFor(el) * 0.7, overwrite: true }
          );
        });
        gsap.to(camera.heroReveal, { value: 1, duration: 1.4, ease: EASE.arrive, delay: 0.35, overwrite: true });
      } else {
        items.forEach((el) => {
          gsap.to(el, { scale: 0, opacity: 0, duration: 0.7, ease: 'expo.in', delay: (1 - delayFor(el)) * 0.25, overwrite: true });
        });
        gsap.to(camera.heroReveal, { value: 0, duration: 0.7, ease: 'expo.in', overwrite: true });
      }

      // ripple through the letters from the one nearest the click
      const letters = chars.current;
      if (letters.length) {
        let nearest = 0;
        let best = Infinity;
        letters.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - x) + Math.abs(r.top + r.height / 2 - y) * 0.3;
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        gsap.fromTo(
          letters,
          { yPercent: 0 },
          {
            keyframes: { yPercent: [0, -9, 0], easeEach: 'power2.inOut' },
            duration: 0.9,
            stagger: { each: 0.03, from: nearest },
            overwrite: true,
          }
        );
      }
    },
    { scope: root, dependencies: [flooded] }
  );

  const onWordmark = (e) => {
    // keyboard activation reports 0,0: flood from the button's centre instead
    if (e.detail === 0) {
      const r = e.currentTarget.getBoundingClientRect();
      toggleFlood(r.left + r.width / 2, r.top + r.height / 2);
    } else {
      toggleFlood(e.clientX, e.clientY);
    }
  };

  return (
    <section ref={root} id="top" className="hero">
      <div className="swarm" aria-hidden="true">
        {swarm.map((d) => (
          <div
            key={d.slot}
            className="swarm__slot"
            data-scroll
            data-scroll-speed={PARALLAX[d.slot]}
            style={{ '--top': `${d.top}%`, '--left': `${d.left}%`, '--s': d.size, zIndex: d.zIndex }}
          >
            <div className="swarm__item">
              <SequenceCanvas start={d.startIndex} count={d.numImages} duration={d.duration} active={flooded} />
            </div>
          </div>
        ))}
      </div>

      <div
        className="hero__camera"
        data-camera-anchor
        data-camera-hero
        style={{ '--top': `${cameraBox.top}%`, '--left': `${cameraBox.left}%`, '--s': cameraBox.size }}
      />

      <div className="hero__intro">
        <p className="hero__lead">{HERO.intro}</p>
        <p className="hero__hint">
          <span className="hero__hint-dot" aria-hidden="true" />
          {flooded ? 'Click the name again to drain the red' : 'Click the name to flood the page'}
        </p>
      </div>

      <h1 className="hero__title">
        <button
          type="button"
          ref={wordmark}
          className="wordmark"
          onClick={onWordmark}
          aria-pressed={flooded}
          aria-label={flooded ? 'Thirtysixstudios: drain the red' : 'Thirtysixstudios: flood the page red'}
          data-cursor="label"
          data-cursor-label={flooded ? 'Drain' : 'Flood'}
        >
          {lines.map((line) => (
            <span key={line} className="wordmark__line" aria-hidden="true">
              {line}
            </span>
          ))}
        </button>
      </h1>
    </section>
  );
}
