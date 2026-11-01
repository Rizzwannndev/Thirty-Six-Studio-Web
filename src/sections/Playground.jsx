import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { camera } from '../lib/camera';
import { SEQUENCES, frameUrl } from '../lib/frames';

/**
 * Playground. The camera pepper ends its journey here and hands over control:
 * drag across the stage (or use the arrow keys) to scrub its frames by hand,
 * pick another pepper, or let it spin again. This shows how the canvas
 * sequences work under the hood.
 */
export default function Playground() {
  const root = useRef(null);
  const stage = useRef(null);
  const readout = useRef(null);
  const [sequence, setSequence] = useState(4);
  const [playing, setPlaying] = useState(true);
  const drag = useRef(null);

  const resume = () => {
    camera.api?.setMode('loop');
    setPlaying(true);
  };

  // live frame readout while the section is on screen
  useGSAP(
    () => {
      let on = false;
      const update = () => {
        const api = camera.api;
        if (!on || !api || !readout.current) return;
        const frame = String(api.getFrame() + 1).padStart(3, '0');
        if (readout.current.textContent !== frame) {
          readout.current.textContent = frame;
          stage.current.setAttribute('aria-valuenow', api.getFrame() + 1);
        }
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          on = self.isActive;
        },
        // leaving the playground always returns the pepper to its loop
        onLeave: () => resume(),
        onLeaveBack: () => resume(),
      });
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    },
    { scope: root }
  );

  useEffect(() => () => camera.api?.setMode('loop'), []);

  const scrubBy = (deltaFrames) => {
    const api = camera.api;
    if (!api) return;
    api.setFrame(api.getFrame() + deltaFrames);
    setPlaying(false);
  };

  const onPointerDown = (e) => {
    stage.current.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, frame: camera.api?.getFrame() ?? 0 };
    stage.current.classList.add('is-dragging');
  };
  const onPointerMove = (e) => {
    if (!drag.current || !camera.api) return;
    const width = stage.current.offsetWidth;
    const frames = camera.api.getCount();
    const delta = ((e.clientX - drag.current.x) / width) * frames * 1.2;
    camera.api.setFrame(drag.current.frame + delta);
    setPlaying(false);
  };
  const endDrag = () => {
    drag.current = null;
    stage.current?.classList.remove('is-dragging');
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') scrubBy(step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') scrubBy(-step);
    else if (e.key === ' ' || e.key === 'Enter') togglePlay();
    else return;
    e.preventDefault();
  };

  const togglePlay = () => {
    const next = !playing;
    camera.api?.setMode(next ? 'loop' : 'manual');
    setPlaying(next);
  };

  const choose = (id) => {
    setSequence(id);
    const seq = SEQUENCES[id];
    camera.api?.setSequence(seq.start, seq.count);
  };

  return (
    <section ref={root} id="playground" className="section playground" aria-labelledby="playground-title">
      <div className="playground__head">
        <h2 id="playground-title" className="section-title">
          Turn it yourself
        </h2>
        <p>
          Every pepper on this site is 150 still frames drawn onto a canvas, one after another. Drag
          across the stage, or use the arrow keys, to turn this one by hand.
        </p>
      </div>

      <div
        ref={stage}
        className="playground__stage"
        role="slider"
        tabIndex={0}
        aria-label="Pepper rotation, frame"
        aria-valuemin={1}
        aria-valuemax={150}
        aria-valuenow={1}
        data-cursor="label"
        data-cursor-label="Drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div className="playground__camera" data-camera-anchor />
        <p className="playground__readout" aria-hidden="true">
          Frame <span ref={readout}>001</span> of 150
        </p>
      </div>

      <div className="playground__controls">
        <div className="playground__peppers" role="radiogroup" aria-label="Choose a pepper">
          {SEQUENCES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={sequence === s.id}
              aria-label={`Pepper ${s.id + 1}`}
              className="playground__pepper"
              onClick={() => choose(s.id)}
            >
              <img src={frameUrl(s.start)} alt="" loading="lazy" decoding="async" width="56" height="56" />
            </button>
          ))}
        </div>
        <button type="button" className="pill" onClick={togglePlay} aria-pressed={!playing}>
          {playing ? 'Pause the spin' : 'Let it spin'}
        </button>
      </div>
    </section>
  );
}
