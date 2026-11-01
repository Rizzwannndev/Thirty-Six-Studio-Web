# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary audience: people judging Rizwan Waseem's frontend craft: recruiters, hiring managers, creative directors and prospective clients. They open the site from a portfolio, LinkedIn or a job application and spend a few minutes deciding whether he can build award-level interactive sites. They come to watch the motion and interaction and scroll through to the end.

## Product Purpose
The site is a portfolio recreation and expansion of the Thirtysixstudio creative studio website. It shows that the author can take an existing creative identity and turn it into a complete, art-directed, production-quality studio site. It works if a visitor comes away convinced of the motion, interaction and engineering quality and contacts the author or visits his LinkedIn.

## Positioning
The site reproduces the studio's signature pieces exactly: canvas image sequences of animated peppers, oversized wordmark typography, and the click-to-flood white→red transformation. Everything else is built as a full studio experience around them.

## Capabilities and Constraints
- Stack: React 19, Vite 7, Tailwind v4, GSAP (+ @gsap/react), locomotive-scroll v5.
- Three things must stay: the canvas image-sequence hero with the oversized "Thirtysixstudios" wordmark; smooth Locomotive scrolling; and the click-on-heading circular expansion that turns the page from white to red and reveals the canvases.
- Hero frames (~1000 PNGs) are hotlinked from thirtysixstudio.com (`src/canvasImages.js`). This is an external dependency.

## Brand Commitments
- Name "Thirtysixstudios", with a red (#fd2c2a) and white identity.
- Footer credit is required: "Designed and developed by Rizwan Waseem", linked to https://www.linkedin.com/in/rizwan-waseem/.
- Contact email: rizwanwaseem757@gmail.com.

## Evidence on Hand
- Pepper image sequences (src/canvasImages.js, src/data.js) and the original hero copy in src/App.jsx.
- The repo contains no real client work, case studies, testimonials, awards or metrics. Selected-work entries are concept projects built from the existing art and must be labeled as concept work. Do not invent clients, awards, figures or press.

## Product Principles
- Evolve the original rather than replace it. Its three signature moments lead.
- Motion is the proof: every animation has to show craft and serve a purpose.
- Be honest about the portfolio framing: concept work is labeled as concept work.
- Production quality includes mobile, reduced motion and performance.

## Accessibility & Inclusion
Respect prefers-reduced-motion with full static fallbacks. Support keyboard navigation of the menu and links.
