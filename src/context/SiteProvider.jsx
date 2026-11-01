import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap, ScrollTrigger } from '../lib/gsap';
import useMediaQuery from '../hooks/useMediaQuery';
import { SiteContext } from './site';

const FLOOD_LOCK_MS = 1300;

export default function SiteProvider({ children }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [flooded, setFlooded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const floodOrigin = useRef({ x: 0, y: 0 });
  const floodLock = useRef(0);
  const scrollRef = useRef(null);

  // Locomotive Scroll v5 (Lenis underneath). Created once and kept for the
  // lifetime of the page. It drives native window scroll, so ScrollTrigger
  // reads the same scroll position; we only have to tell it when to update.
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: reducedMotion ? 1 : 0.095,
        smoothWheel: !reducedMotion,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      },
      scrollCallback: () => ScrollTrigger.update(),
      // Drive Lenis from GSAP's ticker so smooth scroll, ScrollTrigger and
      // every canvas share a single requestAnimationFrame loop.
      initCustomTicker: (render) => gsap.ticker.add(render),
      destroyCustomTicker: (render) => gsap.ticker.remove(render),
    });
    gsap.ticker.lagSmoothing(0);
    scrollRef.current = scroll;

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      scroll.destroy();
      scrollRef.current = null;
    };
  }, [reducedMotion]);

  const toggleFlood = useCallback((x, y) => {
    const now = performance.now();
    if (now < floodLock.current) return; // ignore clicks mid-transition
    floodLock.current = now + FLOOD_LOCK_MS;
    floodOrigin.current = {
      x: x ?? window.innerWidth / 2,
      y: y ?? window.innerHeight / 2,
    };
    setFlooded((value) => !value);
  }, []);

  const scrollTo = useCallback(
    (target, options = {}) => {
      const scroll = scrollRef.current;
      if (!scroll) return;
      scroll.scrollTo(target, {
        duration: reducedMotion ? 0 : 1.6,
        immediate: reducedMotion,
        easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2),
        ...options,
      });
    },
    [reducedMotion]
  );

  // Freeze smooth scrolling while the full-screen menu is open.
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    if (menuOpen) scroll.stop();
    else scroll.start();
  }, [menuOpen]);

  const value = useMemo(
    () => ({
      flooded,
      floodOrigin,
      toggleFlood,
      menuOpen,
      setMenuOpen,
      scrollTo,
      reducedMotion,
    }),
    [flooded, toggleFlood, menuOpen, scrollTo, reducedMotion]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
