---
name: Dealerships
description: A dealer review site that shows its working parts.
colors:
  engine-teal: "oklch(0.52 0.1 200)"
  engine-teal-night: "oklch(0.72 0.11 195)"
  engine-teal-ink: "oklch(0.45 0.1 200)"
  bay-ink: "oklch(0.2 0.03 220)"
  instrument-panel: "oklch(0.24 0.03 220)"
  instrument-well: "oklch(0.19 0.03 220)"
  reading-positive: "oklch(0.84 0.14 155)"
  reading-neutral: "oklch(0.88 0.03 220)"
  reading-negative: "oklch(0.8 0.13 25)"
  reading-positive-ink: "oklch(0.42 0.11 155)"
  reading-neutral-ink: "oklch(0.4 0.02 220)"
  reading-negative-ink: "oklch(0.45 0.15 25)"
  fault-red: "oklch(0.7 0.17 25)"
  fault-ink: "oklch(0.85 0.08 25)"
  page-ground: "oklch(0.972 0.004 210)"
  page-ink: "oklch(0.21 0.012 225)"
  muted-ink: "oklch(0.49 0.012 220)"
  surface: "oklch(1 0 0)"
  separator: "oklch(0.915 0.006 210)"
typography:
  display:
    fontFamily: "Archivo Variable, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112.5"
  headline:
    fontFamily: "Archivo Variable, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112.5"
  title:
    fontFamily: "Archivo Variable, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo Variable, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  readout:
    fontFamily: "Martian Mono Variable, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 350
    lineHeight: 1.5
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
rounded:
  control: "0.5rem"
  field: "0.75rem"
  panel: "1rem"
  band: "1.5rem"
  pill: "9999px"
spacing:
  gutter: "1rem"
  gutter-wide: "1.5rem"
  container: "72rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.engine-teal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  button-primary-on-dark:
    backgroundColor: "{colors.engine-teal-night}"
    textColor: "{colors.bay-ink}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  button-outline-on-dark:
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  instrument:
    backgroundColor: "{colors.instrument-panel}"
    textColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "28px"
  instrument-field:
    backgroundColor: "{colors.instrument-well}"
    textColor: "{colors.surface}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  example-chip:
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  review-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.page-ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  cta-band:
    backgroundColor: "{colors.engine-teal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.band}"
    padding: "48px 32px"
---

# Design System: Dealerships

## Overview

**Creative North Star: "The Open Engine Bay"**

The hood is up. Dealerships is a review site, but what sets it apart is the machinery underneath: four services, real routes, and a sentiment model reading every review. The visual system treats that machinery as something to show off, not hide. Calm, light pages carry the everyday reading and browsing. When the product shows the system working, it opens the bay: a dark blue-teal ground, an instrument panel, a live status strip, and monospaced readouts of routes, scores and timings that come from the live request.

Its tone is confident and factual. Every number on screen is measured or fetched, never claimed. Outages are named, with what the visitor loses and a way to check again. Known limits of the model are stated where they show up, not hidden. Motion is reserved for the request itself: a pulse travelling along a hop, and a result settling into place.

Two typefaces carry the split between people and machine: Archivo, set slightly wide for display like an automotive spec sheet, and Martian Mono, condensed, for anything a machine produced.

**Key Characteristics:**
- Light, quiet reading pages; a dark instrument wherever the system works in public.
- One accent, Engine Teal, re-tuned per ground: Night Teal on dark, Teal Ink for text on light.
- Archivo for people, Martian Mono for machine output: routes, scores, timings, counts.
- Honest states: offline services, failed hops and stale results are named, with a way to recover.
- Pill-shaped controls, softly rounded containers, no hard edges.

## Colors

One teal accent on teal-tinted neutrals, a separate dark blue-teal family for instruments, and a sentiment scale that only appears as data, in a dark-ground and a light-ground variant.

### Primary
- **Engine Teal** (`engine-teal`): primary buttons, the closing CTA band, request arrows, focus rings and selected chips on light grounds. It's the only colour that asks to be clicked.
- **Night Teal** (`engine-teal-night`): the same role inside the engine bay. Any dark section carries the `bay` class, which remaps the accent to Night Teal, so teal keeps about 7:1 contrast on dark.
- **Teal Ink** (`engine-teal-ink`): teal used as text or links on light grounds, such as request labels in the sequence map and dealer links on review cards (6:1 or better).

### Secondary
- **Bay Ink** (`bay-ink`): the dark ground of the hero, the open engine bay. Large sections only, never text. Also the browser `theme-color`.
- **Instrument Panel** (`instrument-panel`): the raised panel that holds a live tool on Bay Ink.
- **Instrument Well** (`instrument-well`): input fields recessed into an instrument panel.

### Tertiary (sentiment readings)
- **Readings on dark** (`reading-positive`, `reading-neutral`, `reading-negative`): the result label and meter marker inside an instrument.
- **Readings on light** (`reading-positive-ink`, `reading-neutral-ink`, `reading-negative-ink`): the label and dot on review cards (8:1 or better on white).
- **Fault Red** (`fault-red`): the dot and dashed line for a failed hop or offline service.
- **Fault Ink** (`fault-ink`): error and validation text on dark grounds.

### Neutral
- **Page Ground** (`page-ground`): the light page background, tinted faintly toward the brand hue.
- **Page Ink** (`page-ink`): headings and body text on light grounds.
- **Muted Ink** (`muted-ink`): secondary text. It measures 5.2:1 or better on every light surface.
- **Surface** (`surface`): cards and fields on the light page, and white text on dark grounds.
- **Separator** (`separator`): hairlines, lifelines, section borders.

### Named Rules
**The One Voice Rule.** Teal is the only interactive colour. A teal element either acts or traces a live request.

**The Readings Are Data Rule.** Sentiment colours appear only next to a computed sentiment, never as decoration, status, section tint or brand accent. Service status uses teal (up) and Fault Red (down).

**The Ground Decides Rule.** Pick the accent variant from the ground: Night Teal in the bay, Teal Ink for text on light, Engine Teal for fills on light.

## Typography

**Display Font:** Archivo Variable at 112.5% width (with system sans fallback)
**Body Font:** Archivo Variable at normal width
**Label/Mono Font:** Martian Mono Variable at 75% width, weight 350

Both are self-hosted through Fontsource (`@fontsource-variable/archivo`, `@fontsource-variable/martian-mono`) and imported by the routes that use them.

**Character:** A grotesque with an engineered, slightly wide stance for the reading voice, and a condensed technical mono for the machine's voice. People speak in Archivo; the system speaks in Martian Mono.

### Hierarchy
- **Display** (600, 2.25rem → 3rem, 1.1, semi-expanded): the hero H1 only, `text-balance`.
- **Headline** (600, 1.875rem → 2.25rem, ~1.15, semi-expanded): section headings and the CTA heading, `text-balance`.
- **Title** (600, 1.125rem): panel headings and service names in the system map.
- **Body** (400, 1rem; 1.125rem for hero and section intros): paragraphs, kept to 65ch.
- **Readout** (350 mono, 0.75rem, condensed, tabular numerals): routes, scores, timings, counters, step numbers.

### Named Rules
**The Machine Voice Rule.** Monospace is for things a machine produced or addresses: routes, payloads, scores, milliseconds. Never use it for headings, buttons or marketing copy.

**The Spec Sheet Rule.** Display and headline type is semi-expanded (112.5%) with tight tracking (-0.025em). Hierarchy comes from size, width and weight, never from colour or gradient text.

## Layout

There is a single centred container of 72rem with a 1rem gutter on phones and 1.5rem from `sm` up. Sections breathe vertically at 5–6rem.

The hero is a three-part grid. On desktop, the copy sits centred in the left column, the status strip anchors to the bottom of that column, and the instrument spans both rows on the right (capped at 30rem). On mobile the order is copy → instrument → status strip, so the live result arrives sooner.

The page reads as: engine-bay hero → sample reviews (light) → sequence map (secondary ground) → CTA band → footer.

The system map lays four service lanes on an 8-track grid with no column gap, so each lifeline and header share a lane centre. Below `md` it becomes a numbered list with "From → To" and a written request/reply tag on each step.

Breakpoints are Tailwind's defaults (`sm` 640, `md` 768, `lg` 1024). There's no horizontal scroll at 390px. On touch devices (`pointer: coarse`), chips and buttons grow to 44px tall.

## Elevation & Depth

The light pages are almost flat. Grouping comes from tonal layering (page ground, then secondary bands, then white surfaces) and 1px separators.

Real depth belongs to the engine bay. An instrument panel lifts off Bay Ink with one long, soft, offset shadow tinted in the bay's hue, and its fields sit recessed in a darker well.

### Shadow Vocabulary
- **Instrument lift** (`box-shadow: 0 30px 60px -24px oklch(0.08 0.03 220 / 0.9)`): only under an instrument panel on a dark ground.

### Named Rules
**The Lit Bay Rule.** Shadows that read as shadows exist only in the dark engine bay. Light pages get depth from tone and hairlines.

## Shapes

Controls are pills: buttons, example chips and status dots are fully round. Containers are softly rounded and grow with their size: fields 0.75rem, panels and review cards 1rem, full-width bands 1.5rem. Borders are 1px hairlines: white at 12–15% on dark, `separator` on light, dashed for empty states. There are no coloured side borders thicker than 1px, hard corners or offset block shadows.

## Components

### Buttons
- **Shape:** pill (`rounded.pill`), large size on heroes and CTAs.
- **Primary:** Engine Teal fill with white label on light grounds. Inside the bay it becomes Night Teal with a Bay Ink label. One filled primary per view region.
- **Outline on dark:** white label, 40–60% white border, faint white wash on hover. Secondary actions on Bay Ink or teal, including the instrument's Analyze button.
- **Secondary (on teal):** white fill with deep teal label (`oklch(0.25 0.05 200)`), inside the CTA band.
- **Busy:** `aria-disabled` with reduced opacity and a progress cursor, never `disabled`, so keyboard focus stays put.

### Chips
- **Example chips:** 1px white/15% outline, xs label. Selected uses the teal border plus a 15% teal wash (`aria-pressed`). Focus is a white outline, distinct from selected. Each one is a one-tap preset, not a filter.

### Cards / Containers
- **Review card:** white surface, 1px separator border, `rounded.panel`, 24px padding. It holds the sentiment label (dot plus word in the light-ground reading colour) with a mono score, the quoted review, then the reviewer, car and a Teal Ink dealer link.
- **Empty or failed state:** dashed separator border, one sentence naming the cause, and a "Try again" pill.
- **CTA band:** Engine Teal, `rounded.band`, full container width; a product-specific heading, one sentence, a primary and an outline action.

### Inputs / Fields
- **Instrument field:** Instrument Well fill, 1px white/15% border, `rounded.field`, 15px text with relaxed leading, teal caret, thin translucent scrollbar. Focus switches the border to teal and adds a soft teal ring.
- **Validation:** runs on submit and shows a Fault Ink sentence directly under the field in an always-mounted `role="alert"`, wired up with `aria-describedby`. An invalid field switches its border to Fault Red. The control is never silently disabled.

### Navigation
- Sticky 64px bar, background at 85% with backdrop blur, wordmark "Dealerships" semi-expanded. Text links on desktop. Below `sm`, a 44px menu button (`aria-expanded`, closes on Escape) reveals Dealers and About this project. It closes on Escape or a tap outside.

### The Instrument (signature component)
This is the reusable surface for showing the system working. Use it anywhere the product exposes a live mechanism. It has five parts, in order:
1. **Header:** title plus a mono tag naming the engine (e.g. "NLTK VADER").
2. **Input:** an Instrument field, presets as example chips, then a row with the mono character count, a "Ctrl ↵ to run" hint and the outline Analyze button.
3. **Hop path:** dots joined by 1px lines, one per service the request touches, each labelled with name and mono route. States are idle (white 25%), active (teal ring with ping), done (teal fill), failed (Fault Red dot plus dashed line). While a request is in flight, a teal pulse travels each line (`hop`: 1.1s, staggered 550ms per hop).
4. **Reading:** the result in its sentiment colour, a −1…+1 meter with the neutral band marked, and mono readouts in plain words ("score", "lexicon weight: 35% positive · …" rounded to total 100, "Django → Flask 12 ms · round trip 40 ms"; the run made on page load is marked "sample text"). It settles in with `reveal` (420ms, blur 4px → 0, rise 6px, expo-out). A result stays tied to the exact text it read. Edited text dims it with "Text edited · press Analyze to update", and a new request dims it while pending. A one-line note under every reading states the model's limits (the "but" rule when it applies, otherwise sarcasm).
5. **Failure:** a plain sentence naming which service didn't answer (or that the request timed out), plus "Try again", which hands focus to the result area.

Screen readers get one short live announcement per outcome. Under reduced motion every state stays and the travel and reveal are dropped.

### Status Strip (signature component)
One row per backend service (dot, name, mono timing or "offline"), fed by `/djangoapp/status`. When everything is up, a live sentence about the data follows. When something is down, a sentence names the service and what the visitor loses, with a "Check again" link. If Django itself is down, the other services read as unknown, not down.

### Sequence Map (signature component)
A service-lane diagram for explaining a request path. It has lane headers (name, mono tech, one-line role), hairline lifelines, teal solid arrows with Teal Ink labels for requests, and muted dashed arrows for replies, with mono labels and step numbers. Steps must mirror real code, in order, and example ids are labelled as examples.

## Do's and Don'ts

### Do:
- **Do** show live system output (routes, scores, ms) in the Readout mono with tabular numerals.
- **Do** name the failing service, say what the visitor loses, and offer a retry. Never let a block silently disappear.
- **Do** use the Instrument language (Bay Ink, `bay` class, Instrument Panel, hop path) whenever a page demonstrates a mechanism.
- **Do** use `text-balance` and the semi-expanded width on every display and headline.
- **Do** state a model's known limits where they show up.
- **Do** label demonstration text as sample text; every number must come from the API.

### Don't:
- **Don't** use sentiment colours outside a computed reading, including for service status.
- **Don't** use monospace for headings, buttons, or anything a person says.
- **Don't** add eyebrow chips or kickers above headings.
- **Don't** use Engine Teal for text on light grounds (use Teal Ink) or on dark grounds (use Night Teal via `bay`).
- **Don't** use stock car photos or placeholder silhouettes to fill space. A demonstration of the product beats a picture of a car.
- **Don't** use gradient text, glass decoration, or hard offset shadows.
