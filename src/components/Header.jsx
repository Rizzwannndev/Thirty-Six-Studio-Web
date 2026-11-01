import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { useSite } from '../context/site';
import { NAV } from '../content';
import Menu from './Menu';

const DESKTOP_LINKS = NAV.filter((item) => ['#studio', '#services', '#work', '#contact'].includes(item.href));

/**
 * Header: transparent over the hero, then a solid strip in the current page
 * ground. It slides away while scrolling down and comes back on the first
 * scroll up. It stays put while the menu is open.
 */
export default function Header() {
  const { menuOpen, setMenuOpen, scrollTo } = useSite();
  const header = useRef(null);
  const menuButton = useRef(null);
  const menuOpenRef = useRef(menuOpen);
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useGSAP(() => {
    const el = header.current;
    const show = gsap.quickTo(el, 'yPercent', { duration: 0.6, ease: 'expo.out' });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        el.classList.toggle('is-solid', y > 40);
        if (menuOpenRef.current) return show(0);
        show(self.direction === 1 && y > window.innerHeight * 0.6 ? -110 : 0);
      },
    });
  });

  const go = (event, href) => {
    event.preventDefault();
    scrollTo(href);
  };

  return (
    <>
      <header ref={header} className={`header ${menuOpen ? 'is-menu-open' : ''}`}>
        <a href="#top" className="header__logo" onClick={(e) => go(e, 0)}>
          Thirtysixstudios
        </a>
        <nav className="header__nav" aria-label="Primary">
          <ul>
            {DESKTOP_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="link-line" onClick={(e) => go(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="header__menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="header__menu-text" data-open={menuOpen}>
            <span>Menu</span>
            <span>Close</span>
          </span>
          <span className="header__menu-icon" aria-hidden="true" />
        </button>
      </header>
      <Menu buttonRef={menuButton} />
    </>
  );
}
