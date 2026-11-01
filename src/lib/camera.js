// Shared state for the travelling "camera" pepper.
// `heroReveal` is tweened by the flood transition (0 = white page, 1 = flooded)
// and fades the pepper in or out while it sits on the hero anchor.
// `api` is the SequenceCanvas handle of the camera pepper, so sections such as
// the Playground can scrub, pause or swap its sequence.
export const camera = {
  heroReveal: { value: 0 },
  api: null,
};
