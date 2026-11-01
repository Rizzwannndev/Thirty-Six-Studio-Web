import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { PROCESS } from '../content';

/**
 * "How a project moves". A real sequence, so the steps are numbered. The
 * heading and the pepper hold in a sticky column while each step lights up
 * as it crosses the middle of the screen.
 */
export default function Process() {
  const root = useRef(null);

  useGSAP(
    () => {
      root.current.querySelectorAll('.step').forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: 'is-current',
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="process" className="section process" aria-labelledby="process-title">
      <div className="process__aside">
        <div className="process__sticky">
          <h2 id="process-title" className="section-title">
            How a project moves
          </h2>
          <div className="process__camera" data-camera-anchor data-camera-hold=".process" />
        </div>
      </div>
      <ol className="process__steps">
        {PROCESS.map((step, i) => (
          <li key={step.title} className="step">
            <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
