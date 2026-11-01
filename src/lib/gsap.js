import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// One motion language for the whole site:
// arrivals settle with expo.out, scene changes use expo.inOut,
// and anything tied to the scrollbar is scrubbed linearly.
export const EASE = {
  arrive: 'expo.out',
  scene: 'expo.inOut',
  scrub: 'none',
};

gsap.defaults({ ease: EASE.arrive, duration: 1 });

export { gsap, ScrollTrigger, SplitText, useGSAP };
