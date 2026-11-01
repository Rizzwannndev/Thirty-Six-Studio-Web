import { gsap } from '../lib/gsap';
import { camera } from '../lib/camera';
import { useSite } from '../context/site';
import { SERVICES, SERVICES_INTRO } from '../content';

/**
 * "What we do". A typographic index rather than a card grid. On hover the
 * camera
 * pepper speeds up while you read. Ink grows as a circle from the point the
 * pointer entered, the site's one transition shape.
 */
export default function Services() {
  const { reducedMotion } = useSite();

  const sweep = (e, entering) => {
    const row = e.currentTarget;
    const fill = row.querySelector('.service__fill');
    const r = row.getBoundingClientRect();
    // the ink grows as a circle from where the pointer crossed the edge
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const radius = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) + 2;
    const hidden = `circle(0px at ${x}px ${y}px)`;
    const shown = `circle(${radius}px at ${x}px ${y}px)`;
    row.classList.toggle('is-active', entering);
    camera.api?.setSpeed(entering ? 2.4 : 1);
    if (reducedMotion) {
      gsap.set(fill, { clipPath: entering ? shown : hidden });
      return;
    }
    if (entering) {
      gsap.fromTo(fill, { clipPath: hidden }, { clipPath: shown, duration: 0.7, ease: 'expo.out', overwrite: true });
    } else {
      gsap.fromTo(fill, { clipPath: shown }, { clipPath: hidden, duration: 0.55, ease: 'expo.out', overwrite: true });
    }
  };

  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="services__head">
        <h2 id="services-title" className="section-title">
          What we do
        </h2>
        <p className="services__intro">{SERVICES_INTRO}</p>
      </div>
      <div className="services__body">
        <ul className="services__list">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="service"
              onPointerEnter={(e) => e.pointerType === 'mouse' && sweep(e, true)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && sweep(e, false)}
            >
              <span className="service__fill" aria-hidden="true" />
              <h3 className="service__title">{s.title}</h3>
              <div className="service__detail">
                <p>{s.body}</p>
                <ul className="service__tags" aria-label={`${s.title} includes`}>
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <div className="services__aside">
          <div className="services__camera" data-camera-anchor data-camera-hold=".services" />
        </div>
      </div>
    </section>
  );
}
