import { useLayoutEffect, useRef } from 'react';
import { useSite } from '../context/site';
import { CONTACT_EMAIL, LINKEDIN_URL, NAV } from '../content';

export default function Footer() {
  const { scrollTo } = useSite();
  const mark = useRef(null);

  // the closing wordmark always spans the full footer width
  useLayoutEffect(() => {
    const el = mark.current;
    const fit = () => {
      const parent = el.parentElement;
      el.style.fontSize = '100px';
      el.style.fontSize = `${(100 * parent.clientWidth) / el.scrollWidth}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="footer" data-theme="ink">
      <div className="footer__top">
        <p className="footer__pitch">
          Design, animation and technology for brands with something to say.
        </p>
        <nav className="footer__col" aria-label="Footer">
          <p className="footer__heading">Sections</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-line" onClick={(e) => go(e, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__col">
          <p className="footer__heading">Contact</p>
          <ul>
            <li>
              <a className="link-line" href={`mailto:${CONTACT_EMAIL}`}>
                Email
              </a>
            </li>
            <li>
              <a className="link-line" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#top" className="link-line" onClick={(e) => go(e, 0)}>
                Back to top
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__credit">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="link-line">
            Designed and developed by Rizwan Waseem
          </a>
        </p>
        <p className="footer__note">
          A portfolio recreation of the Thirtysixstudio site. The pepper image sequences belong to
          Thirtysixstudio, and the projects shown are concept work.
        </p>
      </div>

      <div className="footer__mark" aria-hidden="true">
        <span ref={mark}>Thirtysixstudios</span>
      </div>
    </footer>
  );
}
