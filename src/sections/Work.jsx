import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { SEQUENCES } from '../lib/frames';
import { useSite } from '../context/site';
import SequenceCanvas from '../components/SequenceCanvas';
import { PROJECTS } from '../content';

/**
 * "Selected work". On wide screens the section pins and the projects scroll
 * sideways. The camera pepper rides the progress rail as the playhead. On
 * small screens, or with reduced motion, the panels stack vertically.
 */
export default function Work() {
  const { reducedMotion } = useSite();
  const root = useRef(null);
  const track = useRef(null);
  const thumb = useRef(null);
  const rail = useRef(null);
  const fill = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: '(min-width: 900px)', reduce: '(prefers-reduced-motion: reduce)' },
        ({ conditions }) => {
          if (!conditions.wide || conditions.reduce) return;
          const distance = () => track.current.scrollWidth - window.innerWidth;
          const tween = gsap.to(track.current, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              // the fixed header would cut a band through the panels
              onToggle: (self) => document.querySelector('.header')?.classList.toggle('is-over-reel', self.isActive),
              onUpdate: (self) => {
                const travel = rail.current.offsetWidth - thumb.current.offsetWidth;
                gsap.set(thumb.current, { x: self.progress * travel });
                gsap.set(fill.current, { scaleX: self.progress });
              },
            },
          });

          // project titles drift against the scroll for depth
          gsap.utils.toArray('.project__title', root.current).forEach((title) => {
            gsap.fromTo(
              title,
              { xPercent: 12 },
              {
                xPercent: -12,
                ease: 'none',
                scrollTrigger: {
                  trigger: title.closest('.project'),
                  containerAnimation: tween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            );
          });
        }
      );
      return () => {
        mm.revert();
        document.querySelector('.header')?.classList.remove('is-over-reel');
      };
    },
    { scope: root, dependencies: [reducedMotion] }
  );

  return (
    <section ref={root} id="work" className={`work ${reducedMotion ? 'is-static' : ''}`} aria-labelledby="work-title">
      <div ref={track} className="work__track">
        <div className="work__intro">
          <h2 id="work-title" className="section-title">
            Selected work
          </h2>
          <p>
            Five concept projects, each built around one of our pepper sequences. They show how we
            would take a brand from a single frame to a full campaign.
          </p>
          <div className="work__camera" data-camera-anchor />
        </div>
        {PROJECTS.map((p, i) => {
          const seq = SEQUENCES[p.sequence];
          return (
            <article
              key={p.title}
              className={`project project--${p.ground}`}
              data-theme={p.ground === 'ink' ? 'ink' : undefined}
              aria-labelledby={`project-${i}`}
            >
              <div className="project__media">
                <SequenceCanvas start={seq.start} count={seq.count} duration={3.6} />
              </div>
              <div className="project__meta">
                <h3 id={`project-${i}`} className="project__title">
                  {p.title}
                </h3>
                <p className="project__summary">{p.summary}</p>
                <ul className="project__disciplines" aria-label="Disciplines">
                  {p.disciplines.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="project__note">Concept project, {p.year}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="work__progress" aria-hidden="true">
        <div ref={rail} className="work__rail">
          <div ref={fill} className="work__fill" />
          <div ref={thumb} className="work__thumb" data-camera-anchor />
        </div>
      </div>
    </section>
  );
}
