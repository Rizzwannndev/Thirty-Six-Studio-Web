import { useRef } from 'react';
import { gsap, SplitText, useGSAP, EASE } from '../lib/gsap';
import { useSite } from '../context/site';
import useMediaQuery from '../hooks/useMediaQuery';
import SequenceCanvas from '../components/SequenceCanvas';
import data from '../data';
import { CONTACT_EMAIL } from '../content';

/**
 * "Talk to us". The heading rises like the wordmark did at load, closing the
 * page with the gesture it opened with. When the page is flooded, the
 * original second canvas layout (data[1]) drifts behind it.
 */
export default function Contact() {
  const { flooded, reducedMotion } = useSite();
  const wide = useMediaQuery('(min-width: 900px)');
  const root = useRef(null);
  const title = useRef(null);
  const button = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const split = SplitText.create(title.current, { type: 'chars', mask: 'chars' });
      gsap.from(split.chars, {
        yPercent: 105,
        duration: 1.4,
        stagger: 0.04,
        ease: EASE.arrive,
        scrollTrigger: { trigger: title.current, start: 'top 85%', once: true },
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  // a magnetic pull on the main action, mouse only
  const onMove = (e) => {
    if (reducedMotion || e.pointerType !== 'mouse') return;
    const r = button.current.getBoundingClientRect();
    gsap.to(button.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
      duration: 0.6,
      ease: 'power3.out',
    });
  };
  const onLeave = () => gsap.to(button.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });

  return (
    <section ref={root} id="contact" className="section contact" aria-labelledby="contact-title">
      {wide && (
        <div className="contact__swarm" aria-hidden="true">
          {data[1].map((d, i) => (
            <div
              key={i}
              className={`contact__pepper ${flooded ? 'is-on' : ''}`}
              style={{ '--top': `${d.top}%`, '--left': `${d.left}%`, '--s': d.size, transitionDelay: `${i * 90}ms` }}
            >
              <SequenceCanvas start={d.startIndex} count={d.numImages} duration={d.duration} active={flooded} />
            </div>
          ))}
        </div>
      )}
      <h2 ref={title} id="contact-title" className="contact__title">
        Talk to us
      </h2>
      <div className="contact__body">
        <p>
          Have a campaign in mind, or need a hand with one stage of it? Tell us what you are making
          and when it needs to go live.
        </p>
        <a
          ref={button}
          className="contact__cta"
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('New project')}`}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <span className="contact__cta-fill" aria-hidden="true" />
          <span className="contact__cta-text">Email the studio</span>
        </a>
        <a className="contact__email link-line" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </div>
      <div className="contact__camera" data-camera-anchor />
    </section>
  );
}
