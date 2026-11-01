# Thirty Six Studios: Upgrade Documentation

This document explains how the site was upgraded from a single hero page into a complete studio website, and how the new code fits together. It is written for the next developer who has to maintain it.

- **Stack:** React 19, Vite 7, Tailwind CSS v4, GSAP 3.14 (ScrollTrigger and SplitText), Locomotive Scroll v5, and Hanken Grotesk served from the project
- **Commands:** `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

---

## 1. The original implementation

| Area | What it did | Problems found during the audit |
|---|---|---|
| `src/App.jsx` | Everything lived here: nav, hero copy, the giant wordmark, the flood, both canvas groups and a second section | One 300-line component with no separation of concerns |
| `src/Canvas.jsx` | Played a pepper image sequence by tweening a frame index with GSAP | Called `setIndex` on **every frame**, so React re-rendered 60 times a second per canvas (9+ canvases). It created a **new `Image()` every frame** and reset `canvas.width` on every load. `data-scroll-speed={Math.random()}` changed on every render. Animation never paused off screen |
| Locomotive Scroll | `new LocomotiveScroll({ el, smooth, lerp, ... })` was re-created whenever the canvas toggled, plus a rAF loop that called `locoRef.current.update()` | Those are **v4 options**. v5 (the installed version) is built on Lenis and ignores them. `update()` does not exist in v5, so the rAF loop threw a TypeError. Destroying and re-creating the instance on every toggle reset the scroll state |
| Flood transition | A `div#bg-fill-overlay` was appended to `<body>`, scaled with a CSS transition, and `setTimeout(1000)` then set `body.style.backgroundColor` | Not reversible (turning it off cut straight to white). Timing relied on `setTimeout`. The overlay sat behind the content |
| `Components/Cursor.jsx` | Followed the mouse with `gsap.to('#cursor')` on every mousemove | Created a new tween per mouse event. It also showed on touch devices |
| Assets | `src/canvasImages.js`: 1050 frame URLs on thirtysixstudio.com (7 sequences of 150 frames). `src/data.js`: 9 canvas layouts, of which only 2 were used | |

## 2. What was kept (the three foundations)

1. **Canvas image-sequence hero and the oversized wordmark.** It uses the same 1050 frames and the same `data[0]` layout. The wordmark is now a real `<button>` inside the `<h1>`, scaled so it spans the full width exactly at any viewport.
2. **Locomotive smooth scrolling.** It is now a single Locomotive Scroll v5 instance for the life of the page, configured correctly (see §5).
3. **The click-to-flood transformation.** Clicking the name still grows a red circle from the click point and reveals the pepper swarm. It is now cinematic and reversible (see §4).

## 3. New structure

```
src/
  main.jsx                 entry: font, locomotive css, global css
  App.jsx                  page composition only
  content.js               all copy (services, concept projects, process, contact)
  data.js                  original canvas layouts (unchanged)
  canvasImages.js          original 1050 frame URLs (unchanged)
  index.css                tokens + all component styles, one section per block
  context/
    site.js                SiteContext + useSite()
    SiteProvider.jsx       flood state, menu state, Locomotive Scroll, scrollTo()
  lib/
    gsap.js                registers ScrollTrigger, SplitText, useGSAP; shared EASE
    frames.js              shared frame cache + concurrency-limited loader
    camera.js              shared state for the travelling pepper
    env.js                 reduced-motion / coarse-pointer checks
  hooks/useMediaQuery.js   useSyncExternalStore media queries
  components/
    SequenceCanvas.jsx     canvas image-sequence player (replaces Canvas.jsx)
    CameraPepper.jsx       the travelling "camera" pepper
    FloodLayer.jsx         the white→red circular flood
    Header.jsx             smart header + menu button
    Menu.jsx               full-screen menu
    Cursor.jsx             custom cursor with states (replaces Components/Cursor.jsx)
  sections/
    Hero.jsx  Manifesto.jsx  Services.jsx  Work.jsx
    Process.jsx  Playground.jsx  Contact.jsx  Footer.jsx
```

Removed: `src/Canvas.jsx`, and `src/Components/Cursor.jsx` was moved to `src/components/Cursor.jsx` with a two-step `git mv`, so the case change is recorded in git. Their behaviour was rebuilt in `SequenceCanvas.jsx` and `components/Cursor.jsx`. The folder was renamed to lowercase `components/` so imports also work on case-sensitive file systems (Linux CI and hosting).

### Page narrative ("the pepper is the camera")

The chosen concept: one pepper leaves the hero swarm and travels through the whole page. It lands in each section, does something there, and moves on.

| Section | id | What happens |
|---|---|---|
| Hero | `#top` | The original composition. The wordmark rises out of its baseline on load. Clicking it floods the page (§4). After the flood, the large pepper on the right becomes the camera pepper and follows you down the page |
| Studio (manifesto) | `#studio` | The original studio statement inks in word by word, scrubbed to the scroll. Three principles sit below. The pepper settles beside the text |
| Services | `#services` | A typographic index (not cards). On hover, ink grows across the row as a **circle from the point the pointer entered**, and the pepper spins faster while you read. The pepper holds in a sticky column |
| Selected work | `#work` | Five **concept projects**, labelled as such, each playing its own pepper sequence. On desktop the section pins and scrolls horizontally, titles drift for depth, and the pepper rides the progress rail as the playhead. On tablet and mobile the panels stack |
| Process | `#process` | Four numbered steps (a real sequence). The heading and pepper stick while each step lights up at mid-screen |
| Playground | `#playground` | The experimental showcase. The pepper lands in a circular stage and the visitor can **drag or use the arrow keys to scrub its 150 frames**, swap between the 7 peppers, or pause and resume the spin |
| Contact | `#contact` | "Talk to us" rises the same way the wordmark did, bookending the page. A magnetic email button. When flooded, the original `data[1]` canvas layout drifts behind it |
| Footer | — | Navigation, contact, LinkedIn, back to top, the credit **"Designed and developed by Rizwan Waseem" → https://www.linkedin.com/in/rizwan-waseem/**, a portfolio-recreation disclaimer, and a closing red wordmark |

## 4. Animation and interaction

**Motion language** (`src/lib/gsap.js`): arrivals use `expo.out`, scene changes use `expo.inOut`, and anything tied to the scrollbar is scrubbed linearly. Circles growing from the point of action are the only transition shape, used for the flood, the menu and the CTA hover fill.

- **Flood** (`components/FloodLayer.jsx` + `sections/Hero.jsx`)
  - A fixed red layer animates `clip-path: circle()` from the exact click point to the farthest corner (1.25s, `expo.inOut`).
  - When it finishes, `html.is-flooded` swaps the `--ground` token to red, so every section and the header follow.
  - At the same time, the pepper swarm grows in **ordered by distance from the click** with a little rotation, the camera pepper fades and scales into its slot, and the wordmark letters ripple outward from the clicked letter.
  - Draining reverses the whole thing toward the new click point.
  - Keyboard activation floods from the centre of the button. A 1.3s lock ignores double clicks.
  - The menu also has a flood/drain toggle, so the transformation can be triggered from anywhere.
- **Camera pepper** (`components/CameraPepper.jsx`)
  - Sections mark the pepper's box with `data-camera-anchor`. On each GSAP tick the fixed pepper is placed between the two anchors that bracket the scroll position (`power2.inOut`).
  - Anchors inside a pinned section hold for the pin distance, measured from `.pin-spacer`.
  - `data-camera-hold="<selector>"` holds an anchor while its column is sticky. Where the column is not sticky (phones), the pepper stays parked on the anchor until the anchor reaches the top of the viewport, so it never drifts over the copy next to it.
  - The canvas runs only while the pepper is visible.
- **Menu** (`components/Menu.jsx`): circular reveal from the menu button, link lines rising out of masks, Esc to close, focus trap, focus returned to the button. Smooth scroll is stopped while it is open.
- **Header** (`components/Header.jsx`): transparent over the hero, a solid strip of the current ground after 40px, hides when scrolling down and returns on scroll up. It is also hidden while the work reel is pinned (`.is-over-reel`, set from `Work.jsx`), so it never cuts a band through the panels.
- **Cursor** (`components/Cursor.jsx`): uses `gsap.quickTo` and only runs on fine pointers. States are set with `data-cursor="label"` plus `data-cursor-label`. Links show a ring, and the cursor inverts on `data-theme="ink"` regions.
- **Ambient motion:** only the pepper sequences themselves and a soft pulse on the hero hint dot.

### Why no React Bits or Three.js

React Bits is copy-paste components, and every effect here is a few lines of GSAP that already shares one ticker. The real image sequences are the visual centrepiece, and a WebGL layer would compete with them and add ~150KB without adding meaning. Both were considered and left out on purpose.

## 5. Scrolling

`context/SiteProvider.jsx` creates **one** `LocomotiveScroll` (v5, Lenis) instance:

```js
new LocomotiveScroll({
  lenisOptions: { lerp: 0.095, smoothWheel: true, touchMultiplier: 1.4 },
  scrollCallback: () => ScrollTrigger.update(),
  initCustomTicker: (render) => gsap.ticker.add(render),
  destroyCustomTicker: (render) => gsap.ticker.remove(render),
});
```

- Lenis drives **native window scroll**, so ScrollTrigger needs no scroller proxy.
- Lenis runs from `gsap.ticker`, so smooth scroll, ScrollTrigger, canvases and the camera share a **single rAF loop**.
- `scrollTo()` from context is used by every nav link (expo in-out, 1.6s, immediate under reduced motion).
- `ScrollTrigger.refresh()` runs after `document.fonts.ready` and `window.load`.
- Parallax still uses Locomotive's `data-scroll-speed` (hero swarm), with fixed values instead of `Math.random()`. Locomotive disables parallax on touch devices automatically.

## 6. Canvas performance

`components/SequenceCanvas.jsx` + `lib/frames.js`:

- **Shared cache.** Each frame URL is downloaded once, however many canvases use it, through a queue of at most 8 concurrent requests. The first frame of a sequence jumps the queue.
- **No React renders while animating.** Frame state lives in a ref and is drawn from `gsap.ticker`. A frame is only redrawn when the index changes.
- **Pauses off screen** (IntersectionObserver, 25% margin) and when `active` is false. The hero and contact swarms only load once the page is flooded.
- **Resolution:** the backing store follows the element size (ResizeObserver), with DPR capped at 2 (1.5 on touch). Images are drawn with `contain`.
- **Touch devices** play every second frame, which halves downloads (525 instead of 1050).
- **Reduced motion** fetches and draws only the first frame of each sequence (7 requests in total).
- **Frame fallback:** while frames stream in, the nearest earlier loaded frame is drawn, so canvases never flash empty.

## 7. Responsive adaptations

| | Desktop ≥ 900px | Tablet / mobile |
|---|---|---|
| Hero | Wordmark on one line, 8 swarm peppers | Below 640px the wordmark breaks onto two fitted lines ("Thirtysix / studios"), 3 swarm peppers sized larger, and the camera slot moves above the wordmark |
| Header | Inline links + menu | Logo + menu only |
| Services / Process | Sticky pepper column | Single column, pepper inline |
| Studio / Services / Work | Pepper anchors sit in a column | Anchors move beside the heading (absolute, 26vw) so there are no empty bands |
| Work | Pinned horizontal reel with progress rail (ink fill shows progress) | Stacked full-width panels, no pin |
| Playground picker | One row | Wraps 4 + 3 |
| Contact | Background swarm | No swarm, stacked CTA |
| Heights | `100svh` with `100vh` fallback, so mobile browser bars don't cause jumps | |

Touch: there is no custom cursor, and the services hover runs only for `pointerType === 'mouse'`. The playground stage uses `touch-action: pan-y`, so a horizontal drag scrubs while a vertical swipe still scrolls.

## 8. Accessibility and reduced motion

- With `prefers-reduced-motion`:
  - The load sequence, word ink and letter rises are skipped.
  - The flood becomes a 0.35s cross-fade.
  - The work reel stacks instead of pinning.
  - Smooth wheel scrolling is off.
  - Process steps stay at full opacity.
  - Canvases show a still frame.
- The wordmark is a `<button aria-pressed>` with a state-aware label.
- The menu is `role="dialog" aria-modal` with a focus trap.
- The playground stage is a `role="slider"` with live `aria-valuenow`. The pepper picker is a `radiogroup`.
- There is a skip link, visible `:focus-visible` rings, and themed selection and scrollbar.

## 9. Dependencies

| Package | Status | Why |
|---|---|---|
| `@fontsource-variable/hanken-grotesk` | **added** | Self-hosted variable grotesk for the whole type system (no Google Fonts request) |
| `gsap` (ScrollTrigger, SplitText) | existing | SplitText is free since GSAP 3.13 and ships in the installed package |
| `@gsap/react`, `locomotive-scroll`, Tailwind | existing | Locomotive is now configured for v5 |

No other packages were installed. QA used a temporary `puppeteer-core` outside the project.

## 10. Testing performed

Production build (`npm run build`) and `npm run lint` both pass with no errors or warnings. Headless Chrome (puppeteer-core against `vite preview`) was run at 1440×900, 834×1112 (touch), 390×844 (touch) and 1440×900 with reduced motion:

- **Console:** zero errors and no page errors at every size.
- **Overflow:** zero horizontal overflow at every section.
- **Flood:** turning it on, draining it and keyboard activation all work.
- **Menu:** opens, focuses the first link, Esc closes, and a menu link scrolls to its section.
- **Services:** the row hover fill works.
- **Playground:** arrow keys step frames and pause, drag scrubs frames, the pepper picker swaps the sequence, and leaving the section resumes the loop.
- **Footer:** the credit links to LinkedIn.
- **Frame requests:** desktop 1050, touch 525, reduced motion 7.

Screenshots are in `.impeccable/review/qa4/`.

## 11. Design review

An independent finish review (Impeccable finish reviewer) returned **fix** with eight items, all applied:

1. Fixed the folder-case problem in git.
2. Kept pure black ink as on the original site, and corrected the design contract, which had mistakenly said #111.
3. Changed the services hover to the circle transition shape.
4. Marked the camera pepper.
5. Hid the header over the pinned reel.
6. Made the progress rail read on every panel colour.
7. Moved a hero pepper off the headline.
8. Removed the empty bands on mobile and changed the picker to wrap 4 + 3.

The verdict pass found one regression: on phones the camera pepper drifted over the Services intro. The mobile Services anchor now sits in the padding band above the heading, and hold anchors that are not sticky stay parked until they reach the viewport top.

The design direction is recorded in `.impeccable/surfaces/src-app-jsx.md` and the product facts in `PRODUCT.md`.

## 12. Known limitations

- **The frames are hotlinked** from `thirtysixstudio.com`. If that site changes or blocks hotlinking, every canvas goes blank (the layout and interactions still work). During development, `curl` on this machine could not resolve the domain while Chrome could. Self-hosting the PNGs (or converting them to WebP sprite sheets) under `public/` would remove the dependency and reduce payload.
- **Payload:** a full flooded desktop session downloads 1050 PNG frames. They are lazy, cached and limited by the queue, but WebP or AVIF conversion would cut that significantly.
- **Not tested:** real iOS Safari or Android hardware, and Firefox. The responsive and touch checks were done in emulated Chrome.
- **Projects are concept work,** labelled on the page. Replace `PROJECTS` in `src/content.js` with real case studies when available.
