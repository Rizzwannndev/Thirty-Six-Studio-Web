# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Rules

- Always inspect existing code before modifying it.
- Never recreate existing components unnecessarily.
- Reuse installed dependencies and existing utilities.
- Avoid unnecessary files and dependencies.
- Make minimal, targeted changes.
- Do not rewrite working code unless necessary.
- Never generate lengthy explanations for simple tasks.
- Test changes before considering them complete.
- Keep project documentation updated.
- Preserve existing design consistency.

## Commands

- `npm run dev`: Vite dev server (http://localhost:5173)
- `npm run build`: production build
- `npm run preview`: serve the production build
- `npm run lint`: ESLint (flat config in `eslint.config.js`)

There is no test framework configured.

## Stack

React 19 + Vite 7, Tailwind CSS v4 via `@tailwindcss/vite` (only preflight is really used; styles live in `src/index.css`), GSAP 3.14 with ScrollTrigger + SplitText + `@gsap/react`, `locomotive-scroll` v5 (Lenis-based), self-hosted Hanken Grotesk via `@fontsource-variable`. Plain JSX.

See `UPGRADE_DOCUMENTATION.md` for the full architecture write-up; `PRODUCT.md` and `.impeccable/surfaces/src-app-jsx.md` hold product truth and the design direction contract; `DESIGN.md` (with `.impeccable/design.json`) records the shipped design system.

## Architecture

Single page. `App.jsx` only composes; copy lives in `src/content.js`.

- **One shared loop.** `context/SiteProvider.jsx` creates the single Locomotive Scroll v5 instance (v4 options like `el`/`smooth` do not exist in v5), drives Lenis from `gsap.ticker`, and calls `ScrollTrigger.update` on scroll. Lenis scrolls the native window, so ScrollTrigger needs no scroller proxy. Use `scrollTo` from `useSite()` for navigation.
- **Flood.** `useSite().toggleFlood(x, y)` flips `flooded`. `FloodLayer` animates the red clip-path circle and then sets `html.is-flooded`, which swaps the `--ground` CSS token. Style flood-aware UI with `var(--ground)` or `html.is-flooded`, not JS.
- **Canvases.** `components/SequenceCanvas.jsx` plays a sequence from `lib/frames.js` (shared cache, queue of 8 requests at a time) on `gsap.ticker`, with no React state. It accepts `active` and exposes a ref API (`setFrame`, `setMode`, `setSpeed`, `setSequence`). `canvasImages.js` is 7 sequences × 150 frames, so a sequence starts at `id * 150` (`SEQUENCES` in `lib/frames.js`). `data.js` holds the original canvas layouts (`data[0]` hero, `data[1]` contact).
- **Camera pepper.** `components/CameraPepper.jsx` moves one fixed canvas between elements marked `data-camera-anchor`. The anchor's box is the pepper's box. Add `data-camera-hero` for the hero slot (its opacity follows `camera.heroReveal`) and `data-camera-hold="<selector>"` to hold while a sticky column is stuck (on phones, where it is not sticky, the pepper stays parked until the anchor reaches the viewport top). Anchors inside ScrollTrigger pins hold automatically. Sections reach the pepper through `camera.api` in `lib/camera.js`.
- **GSAP in React.** Use `useGSAP` from `lib/gsap.js` (plugins are registered there). StrictMode double-runs effects, so prefer `fromTo` over `from` in effects that are not reverted on cleanup, otherwise elements can get stuck at the start values.
- **Cursor states** come from `data-cursor="label" data-cursor-label="..."`, and `data-theme="ink"` marks dark regions.
- **Reduced motion and touch** are handled per feature (see `lib/env.js`, `useSite().reducedMotion`, and the `@media (prefers-reduced-motion)` block in `index.css`).
- **Frames are hotlinked** from thirtysixstudio.com.
