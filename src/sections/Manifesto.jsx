import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { useSite } from '../context/site';
import { MANIFESTO, PRINCIPLES } from '../content';

/**
 * "Who we are". The studio statement inks in word by word at reading pace,
 * scrubbed to the scroll. The pepper settles beside it.
 */
export default function Manifesto() {
  const { reducedMotion } = useSite();
  const root = useRef(null);
  const text = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const split = SplitText.create(text.current, { type: 'words', wordsClass: 'manifesto__word' });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: text.current, start: 'top 78%', end: 'bottom 48%', scrub: true },
        }
      );
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="studio" className="section manifesto" aria-labelledby="studio-title">
      <h2 id="studio-title" className="visually-hidden">
        Who we are
      </h2>
      <div className="manifesto__grid">
        <p ref={text} className="manifesto__text">
          {MANIFESTO}
        </p>
        <div className="manifesto__camera" data-camera-anchor />
      </div>
      <ul className="principles">
        {PRINCIPLES.map((p) => (
          <li key={p.title} className="principle">
            <h3 className="principle__title">{p.title}</h3>
            <p className="principle__body">{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
