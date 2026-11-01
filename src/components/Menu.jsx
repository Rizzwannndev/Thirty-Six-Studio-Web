import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../lib/gsap';
import { useSite } from '../context/site';
import { CONTACT_EMAIL, LINKEDIN_URL, NAV } from '../content';

/**
 * Full-screen menu. It opens with the same circular reveal as the page flood,
 * grown from the menu button, so the site has a single transition shape.
 * Links rise out of line masks. Esc closes it, focus is trapped inside while
 * it is open, and focus goes back to the menu button on close.
 */
export default function Menu({ buttonRef }) {
  const { menuOpen, setMenuOpen, scrollTo, flooded, toggleFlood, reducedMotion } = useSite();
  const panel = useRef(null);
  const [rendered, setRendered] = useState(false);
  const pendingTarget = useRef(null);

  // mount before animating in (adjusting state during render is the React
  // pattern for this); the close animation unmounts it when it finishes
  if (menuOpen && !rendered) setRendered(true);

  useEffect(() => {
    const el = panel.current;
    if (!el || !rendered) return;
    const btn = buttonRef.current.getBoundingClientRect();
    const x = btn.left + btn.width / 2;
    const y = btn.top + btn.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const lines = el.querySelectorAll('[data-menu-line]');
    const extras = el.querySelectorAll('[data-menu-extra]');
    const ctx = gsap.context(() => {
      if (menuOpen) {
        const tl = gsap.timeline();
        if (reducedMotion) {
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' });
        } else {
          tl.fromTo(
            el,
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.9, ease: EASE.scene }
          )
            .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05 }, 0.35)
            .fromTo(extras, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.55);
        }
        el.querySelector('a')?.focus({ preventScroll: true });
      } else {
        const done = () => {
          setRendered(false);
          buttonRef.current?.focus({ preventScroll: true });
          if (pendingTarget.current !== null) {
            scrollTo(pendingTarget.current);
            pendingTarget.current = null;
          }
        };
        if (reducedMotion) {
          gsap.to(el, { opacity: 0, duration: 0.2, ease: 'none', onComplete: done });
        } else {
          gsap.to(el, {
            clipPath: `circle(0px at ${x}px ${y}px)`,
            duration: 0.7,
            ease: EASE.scene,
            onComplete: done,
          });
        }
      }
    }, el);
    return () => ctx.kill();
  }, [menuOpen, rendered, reducedMotion, buttonRef, scrollTo]);

  // Esc to close, Tab cycles between the menu button and the menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key !== 'Tab' || !panel.current) return;
      const focusables = [buttonRef.current, ...panel.current.querySelectorAll('a, button')];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen, buttonRef]);

  if (!rendered) return null;

  const goTo = (e, href) => {
    e.preventDefault();
    pendingTarget.current = href;
    setMenuOpen(false);
  };

  const flood = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleFlood(r.left + r.width / 2, r.top + r.height / 2);
  };

  return (
    <div
      ref={panel}
      id="site-menu"
      className="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-theme="ink"
    >
      <nav className="menu__nav" aria-label="Sections">
        <ul>
          {NAV.map((item) => (
            <li key={item.href} className="menu__item">
              <a href={item.href} className="menu__link" onClick={(e) => goTo(e, item.href)}>
                <span className="menu__mask">
                  <span data-menu-line>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu__aside">
        <div data-menu-extra>
          <p className="menu__heading">Write to us</p>
          <a className="link-line" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>
        <div data-menu-extra>
          <p className="menu__heading">Elsewhere</p>
          <a className="link-line" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <button type="button" className="menu__flood" onClick={flood} aria-pressed={flooded} data-menu-extra>
          <span className="menu__flood-dot" aria-hidden="true" />
          {flooded ? 'Drain the page back to white' : 'Flood the page red'}
        </button>
      </div>
    </div>
  );
}
