---
name: Thirtysixstudios
description: A red and white studio site where one pepper becomes the camera and every surface change grows as a circle from the point of action.
colors:
  studio-red: "#fd2c2a"
  paper: "#ffffff"
  ink: "#000000"
  paper-muted: "rgb(255 255 255 / 0.62)"
typography:
  display:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "fitted to container width"
    fontWeight: 500
    lineHeight: 0.84
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 5.6vw, 7rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.9vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  focus: "2px"
  pill: "999px"
  circle: "50%"
spacing:
  gutter: "clamp(1rem, 3.2vw, 2.75rem)"
  section-y: "clamp(6rem, 13vw, 12rem)"
  header-h: "4rem"
  header-h-mobile: "3.5rem"
  target-min: "2.75rem"
components:
  pill-button:
    textColor: "currentColor"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.25rem"
    height: "2.75rem"
  pill-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag:
    textColor: "currentColor"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.75rem"
  contact-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    width: "clamp(8.5rem, 6rem + 6vw, 11rem)"
  contact-cta-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  menu-flood-toggle:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.25rem 0.5rem 0.6rem"
    height: "2.75rem"
  menu-flood-toggle-hover:
    backgroundColor: "{colors.studio-red}"
    textColor: "{colors.ink}"
  header:
    textColor: "{colors.ink}"
    height: "{spacing.header-h}"
    padding: "0 {spacing.gutter}"
  menu-overlay:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  service-row-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Thirtysixstudios

## Overview

**Creative North Star: "The Pepper Is the Camera"**

The system is a three-ink poster: white paper, studio red, pure black, and nothing else. The material is not illustration or UI chrome but real pepper image sequences played on canvas; one pepper travels between sections as a fixed camera and every layout leaves it a square anchor to land in. Type is a single variable grotesk doing every job, from a wordmark fitted edge to edge across the hero to 13px tags, set tight and heavy-ish (500) at display sizes and plain at reading sizes.

Change happens in circles. The page floods from white to red as a circle growing from the click point, the menu opens as an ink circle from the menu button, a service row fills with ink as a circle from where the pointer crossed its edge, and the contact button fills from its centre. Everything else is held still or scrubbed to the scrollbar. The density is editorial and generous: huge headings, wide section padding, hairline rules, and a lot of open ground for the peppers to move through.

The ground itself is a token. The page background follows `--ground`, which is paper by default and red once flooded, so every surface that sits on the ground recolours with the flood without any per-component logic. Ink and red panels are the only other grounds.

**Key Characteristics:**
- Three colours: paper, studio red, pure black ink. Red is a ground, not an accent sprinkle.
- One grotesk family (Hanken Grotesk Variable) at weight 400 and 500 only.
- Circles from the point of action are the transition shape for surfaces.
- Hairline (1px currentColor) rules and outlines; no fills, cards or shadows for structure.
- Real pepper sequences on canvas are the only imagery.
- Motion: expo.out arrivals, expo.inOut scene changes, linear scrub for scroll.

## Colors

A strict three-ink palette in which red and paper trade places as the page ground and black does all the drawing.

### Primary
- **Studio Red** (`studio-red`): the brand red. It is the flooded page ground, the colour of the flood layer, a panel ground in the work reel, the footer wordmark on ink, the menu link hover, and the hero hint dot before the flood. It appears as large fields, never as a thin accent on a white UI.

### Neutral
- **Paper** (`paper`): the default ground, text on ink, the selection text, and the work-reel progress rail.
- **Ink** (`ink`): pure black. All text and hairlines on paper and red, the menu overlay, the footer, the active service row, dark work panels, the contact button, focus rings (via currentColor), and the scrollbar thumb.
- **Paper Muted** (`paper-muted`): white at 62% on ink, used only for the small column headings in the menu and footer and the footer legal note.

### Named Rules
**The Three Inks Rule.** Paper, studio red and pure black are the whole palette. No greys, tints, gradients of colour or second accent; the only derived value is paper at 62% for secondary text on ink.

**The Ground Token Rule.** Anything that sits on the page ground paints with `var(--ground)`, never a literal paper or red, so the flood recolours it for free. Flood-aware state is styled through `html.is-flooded`, not JavaScript.

## Typography

**Display Font:** Hanken Grotesk Variable (with Helvetica Neue, Helvetica, Arial, sans-serif)
**Body Font:** the same family

**Character:** One neutral grotesk carries the whole voice. Display sizes are set at weight 500 with very tight negative tracking and sub-1 line-heights so headings read as solid blocks; reading text stays at weight 400 with normal tracking.

### Hierarchy
- **Display** (500, fitted to the container width by script, line-height 0.84, -0.05em): the "Thirtysixstudios" wordmark along the bottom of the hero and the red wordmark at the foot of the footer. The contact heading is its sibling at clamp(4.5rem, 1rem + 15vw, 16rem), -0.055em.
- **Headline** (500, `--fs-title`, 0.92, -0.04em): section titles. Per-section display rows use the same recipe at their own sizes: service names up to 6.25rem, project titles up to 7.5rem, process step titles up to 4.5rem, menu links up to 6.5rem, all at 0.9-1.0 line-height and -0.04 to -0.05em.
- **Statement** (400, 1.6-4.25rem clamps, 1.06-1.1, about -0.03em): the hero intro paragraph, the manifesto (with an 18% first-line indent on wide screens) and the footer pitch.
- **Title** (500, `--fs-h3`, 1.1, -0.02em): principle titles.
- **Lead** (400, `--fs-lead`, 1.4): section intros, project summaries, process step bodies, menu and footer links. Measures held at 32-40ch.
- **Body** (400, 1rem, 1.5): running copy; measures at 34ch for short blocks.
- **Label** (400, 0.875rem): column headings, step numbers, readouts, cursor label, pill buttons. Numerals use tabular figures.
- **Tag** (400, 0.8125rem): discipline and service tags inside pills.

### Named Rules
**The One Family Rule.** Every size, from the wordmark to a 13px tag, is Hanken Grotesk Variable at 400 or 500. No second face, no italics, no uppercase tracking.

**The Tight Display Rule.** Anything set above about 2.25rem gets negative tracking (-0.02em to -0.055em) and a line-height below 1.1; mask reveals on split lines carry a descender allowance (0.12-0.14em) so the y is never clipped.

## Layout

The page is a vertical run of full-bleed sections with `--gutter` side padding and `--section-y` vertical padding; the header is a fixed thin row of `--header-h`. Within sections the grid is asymmetric two-column (`minmax(0, 1fr)` against a fixed or fractional second column: 30rem intros, 5fr/7fr process, 1.1fr/1fr projects), and an 18% left offset recurs as the indent line for the manifesto, principles and contact body.

Every section reserves a square, `aspect-ratio: 1` anchor for the travelling camera pepper, sized in viewport units (about 22-26vw on desktop, 26-34vw on mobile). On narrow screens those anchors move into the section's top padding band at the right gutter so they never sit on copy.

The work section is a pinned horizontal reel on wide screens (panels 80vw wide, full height) and stacks vertically below 900px or under reduced motion. Breakpoints in use: 640px (mobile type and header height), 768px (menu and contact collapse to one column), 900px (header nav hides, all two-column grids collapse). Interactive targets are at least 2.75rem tall.

## Elevation & Depth

The system is flat. There are no drop shadows, blurs or tonal surfaces; depth comes from stacking order (flood layer under content, camera pepper over sections, header, menu and cursor above) and from swapping whole grounds between paper, red and ink. The few `box-shadow` values in the build are drawn rings, not elevation: an inset 1px ink outline on the progress rail, a 1px paper halo on its fill, a 1.5px ring on the link cursor, and a ground-coloured gap plus ink ring on the selected playground pepper.

### Named Rules
**The No Lift Rule.** Nothing floats. A surface is separated by a ground change or a 1px currentColor rule, never by a shadow.

## Shapes

Two shapes only: the full circle and the pill. Circles are the playground stage, the contact button, cursor discs, pepper swatches and the flood itself; pills (999px) are buttons, tags, the skip link and the progress rail. Everything rectangular is square-cornered and unbordered except for 1px currentColor hairlines that divide service rows and process steps. Focus rings are a 2px currentColor outline offset 4px (8px around the circular stage).

## Components

### Buttons
Outlined and quiet at rest, filled on intent.
- **Shape:** pill (999px), minimum height 2.75rem.
- **Pill button:** 1px currentColor outline, label size, 0.55rem by 1.25rem padding, so it works on paper, red or ink.
- **Hover / Focus:** fills with ink and turns text to paper over 0.3s; focus shows the 2px currentColor ring.
- **Menu flood toggle:** the pill with a 1.5rem red dot at the leading edge; on hover the whole pill floods red and the dot turns ink.
- **Contact button:** a solid ink circle (8.5-11rem) whose paper fill grows from the centre on hover in 0.6s expo-out, inverting the label. It also follows the pointer magnetically.

### Chips
- **Style:** service and project tags are 1px currentColor pills at the tag size with 0.2rem by 0.75rem padding and 0.4rem gaps. They are not interactive and inherit the colour of whatever ground they sit on.

### Navigation
- **Header:** a thin fixed row, logo left at 1.0625rem/500/-0.02em, section links right with 2rem gaps, then a "Menu" control whose two-line icon rotates into an X and whose word slides to "Close" in a masked swap. It hides on scroll down and returns on scroll up, takes on `--ground` once scrolled, and hides over the work reel. Section links drop out below 900px.
- **Menu overlay:** a full-screen ink panel that opens as a circle from the menu button (0.9s expo.inOut). Giant links (up to 6.5rem, 500, -0.04em) rise line by line from masks, turn red and nudge right on hover. An aside carries contact links, the flood toggle and muted column headings.
- **Inline links:** text links draw a 1px currentColor underline in from the left on hover or focus (0.6s ease-out) instead of a static underline.

### Service Row
A full-width row between hairlines: giant service name left, description and tags right. When the pointer enters, an ink circle grows from the exact entry point to fill the row and the text turns paper; it retracts to the exit point on leave.

### Camera Pepper (signature)
One fixed canvas plays a pepper sequence and moves between square anchors placed in each section, scrubbed to the scroll with a power2.inOut path between anchors. In the playground it sits inside a 1px circular stage the visitor drags to scrub frames, with a tabular readout and a row of circular pepper swatches; the selected swatch gets a paper fill and an offset ink ring.

### Cursor
On fine pointers the system cursor is replaced by a 14px currentColor disc that grows to a 44px ring over links and a 96px disc with a paper label over labelled targets. It turns paper inside regions marked as ink.

### Work Reel Progress
A 0.625rem paper pill rail with an inset ink outline; the travelled part fills in solid ink with a paper halo so it reads on red, ink and paper panels, and a small pepper thumbnail rides along it.

## Do's and Don'ts

### Do:
- **Do** paint grounds with `var(--ground)` and let `html.is-flooded` swap paper for studio red.
- **Do** grow surface changes as a circle (`clip-path: circle()` or a scaled round fill) from the point of the click, hover entry or button.
- **Do** use expo.out for arrivals, expo.inOut for scene changes and a linear scrub for anything tied to the scroll; the CSS equivalent is `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Do** reserve a square anchor for the camera pepper in any new section, and keep it clear of copy on mobile.
- **Do** draw structure with 1px currentColor hairlines and outlines so components survive paper, red and ink grounds.
- **Do** keep reduced motion honest: crossfades instead of circles, no pin, no pulse.

### Don't:
- **Don't** add a colour outside paper, studio red and pure black, and don't soften the ink to an off-black.
- **Don't** use cards, drop shadows or colour gradients to separate content.
- **Don't** introduce a second typeface, italics or letter-spaced uppercase labels.
- **Don't** put a small label or kicker above a section heading; headings stand alone.
- **Don't** use stacked fade-up reveals as the default section entrance; text rises from line masks and surfaces grow as circles.
- **Don't** use illustration, icons or stock imagery; the pepper sequences are the only pictures.
