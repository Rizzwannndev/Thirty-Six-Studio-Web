// Small, synchronous environment checks used outside React render.
const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const isCoarsePointer = () => mq('(pointer: coarse)');
