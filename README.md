# Sridira Lake Creek — lead-capture microsite

A single-project marketing site for **Sridira Lake Creek**, a lake-facing 3 BHK
development at Horamavu, Bengaluru. Long-scroll landing page, mobile-first, built
around one job: capturing qualified leads. **No price appears anywhere on the
site** — the form is the only route to pricing, floor plans and the brochure.

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion.

---

## Quick start

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Leads submitted in dev with no CRM configured land in `./leads.json`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` / `npm start` | Node/Vercel build — `/api/lead` is live |
| `npm run build:static` | Static export to `out/` — see below |
| `npm run typecheck` | `tsc --noEmit` |

---

## Design system

Colour and type come straight off the official **Brand Guidelines** deck.
Structure and spacing rhythm follow the ASBL Legacy reference site.

### Palette — from the brand deck, exact values

| Role | Colour | Hex |
| --- | --- | --- |
| Page ground | Ivory | `#ECEDE5` |
| Text | Charcoal Black | `#231F20` |
| Primary band | Navy Blue | `#063258` |
| Secondary band | Teal | `#006064` |
| Accent on dark | Sky (secondary palette) | `#73B5CC` |

Secondary palette (gold `#C69D64`, forest `#256934`, azure `#0089BF`, petrol
`#174C5B`, pale blue `#BAE3F7`) is available in the Tailwind theme and used
sparingly. Full-bleed sections alternate ivory → navy → teal.

### Type

The brand display face is **Coax**, which is not licensable for web. Two
consequences:

- **The wordmark ships as artwork**, not as type — `public/brand/wordmark-*.png`,
  extracted from the guidelines deck. It is painted through a CSS mask
  (`.wordmark` in `globals.css`) so it renders in `currentColor` and can only
  ever be an approved brand colour. It is never re-typeset in a substitute face,
  never stretched, and never recoloured outside the palette.
- **Headline text uses Bodoni Moda**, the closest free match for Coax's
  high-contrast geometric letterforms. Body text is **Raleway**, the brand body
  face. Both self-host through `next/font`.

The deck sets its own section titles in light, widely-tracked caps — that is the
`.brand-label` / `text-brand-title` treatment, used for "At a Glance".

### Graphic elements

All rebuilt as SVG in `src/components/brand/BrandGraphics.tsx` from one
primitive: the **petal** — a square cell with two opposite corners removed by
quarter-arcs. Everything takes `currentColor`, so it recolours per section.

| Component | Where it comes from |
| --- | --- |
| `BrandMark` | The monogram: two circles, facing petals, half-disc, fanned petals |
| `PetalField` | The oversized translucent rosettes behind most deck pages |
| `MotifBand` | The "Graphic Elements" repeating band, held to the right edge |
| `ContourLines` | "Organic contour lines echo the natural landscape" |
| `RippleRule` | "The gentle ripples of the lake", used as a divider |

`.petal-panel` applies the same geometry to image panels, so photography is
framed by the identity's shape language.

### Structure — measured off the reference site

| Token | Value |
| --- | --- |
| Section rhythm | `88px` top / `112px` bottom |
| Content shell | `1248px`, `40px` gutters |
| Display headings | `48–56px` at ~1.0 line-height |
| Eyebrows | `12px`, 600, uppercase, `0.2em` tracking |
| Buttons | Full pill, `0.8px` border, uppercase, `13px` |
| Header | `72px`, `backdrop-blur(12px)`, hairline underline |

All copy, stats, specs and FAQs live in [`src/lib/site.ts`](src/lib/site.ts).
The specification bullets are verbatim from the brochure — buyers compare them
line by line, so don't paraphrase them.

---

## Lead capture

Every CTA opens the same form through `LeadCTA` → `LeadProvider` → `LeadModal`,
tagged with the section that produced it so ad spend can be attributed per
section later. Capture points:

- Sticky header **Get pricing** button
- Hero primary + brochure CTAs
- Configuration card, amenities, master plan
- **Six floor-plan "Unlock Full Layout" cards — the primary gate**
- Full inline block ~⅔ down the page
- Footer compact form
- Exit intent (once per session, armed only after 12s)
- Mobile action bar + persistent WhatsApp FAB

**Fields:** name, phone (`+91` prefix, 10-digit validation), email, hidden
configuration, optional site-visit date, and a required consent checkbox —
"I agree to be contacted via call/SMS/WhatsApp regarding this project". The
consent box is a TRAI / DPDP Act requirement for Indian real-estate lead forms;
it is validated on both the client and the server. **Don't remove it.**

**On success:** the session is marked unlocked (all six floor plans resolve in
place), a thank-you state promises a callback within `NEXT_PUBLIC_CALLBACK_HOURS`
hours, the brochure is served immediately if `NEXT_PUBLIC_BROCHURE_URL` is set,
and Meta Pixel `Lead` + GA4 `generate_lead` fire with a `source` parameter.

### Delivery chain (`src/app/api/lead/route.ts`)

A lead is only reported as lost if every channel fails:

1. **POST to the GHL inbound webhook** — `GHL_WEBHOOK_URL`, 8s timeout
2. **Email via Resend** — `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`
3. **Append to `leads.json`** — last-resort local sink

If all three fail the payload is logged as a structured error and the visitor is
told to call instead.

---

## Deploying

### Vercel / Node — recommended

Default build. `/api/lead` runs as a route handler and `next/image` optimises on
demand. Set the env vars from `.env.example` in the project settings.

### Static export

```bash
npm run build:static
```

Outputs to `out/`. Images ship unoptimised and **`/api/lead` is not included** —
a POST route handler can't be statically served. Set
`NEXT_PUBLIC_LEAD_ENDPOINT` to an external collector (the GHL inbound webhook
directly, or a small serverless function) or the form will have nowhere to post.

---

## Before launch — open items

These are placeholders on purpose. Nothing here was invented; none of it was in
the source material.

- [ ] **RERA number.** `RERA No: [TO BE CONFIRMED]` appears in the footer and the
      FAQ. Karnataka RERA registration is legally required before advertising or
      selling an under-construction project in Bengaluru. **Blocking.**
- [ ] **Brochure vs. brief conflict — decide which wins.** The digital brochure
      and the original build brief disagree on hard numbers. The site currently
      carries the **brief's** figures. Confirm and reconcile in `src/lib/site.ts`:
      | Field | Build brief (live on site) | Digital brochure |
      | --- | --- | --- |
      | Floors per tower | 28 | 30+ |
      | Homes in Phase 1 | 336 | 360, incl. 12 penthouses |
      | Flat 01 area | 1810 Sft | 1835 SFT |
      | Flat 02 area | 1765 Sft | 1762 SFT |
      | Flat 03 area | 1831 Sft | 1830 SFT |
      | Flat 05 area | 1700 Sft | 1715 SFT |
      | Unit labelling | Plinth in Sqm | SBUA + facing (W/N/E) |
      | Specifications | Earlier revision | Newer revision — veneer doors, digital lock, 800×1600 tiles, Jaguar CP, 100% DG backup, home automation, CCTV, boom barrier, OWC |
      | Builder footprint | "Telangana, Karnataka & Andhra Pradesh" | "across South India" |
      | Consultants | "MEP Consultants" | "SMEPF Consultants" |
      Specifications are the urgent one — buyers read them line by line.
- [ ] **Possession date.** Marked "TBD — confirm with sales team" in the FAQ and
      footer.
- [ ] **Pricing and payment plan.** Deliberately absent sitewide.
- [ ] **Brochure PDF.** Host it and set `NEXT_PUBLIC_BROCHURE_URL` so it is
      delivered on submit rather than promised by email.
- [ ] **Social links.** Placeholder `#` hrefs in `src/components/Footer.tsx`.
- [ ] **Images.** Everything under `public/assets/` is brochure-resolution
      (~1200px) extracted from the source PDFs. Swap in the marketing team's
      high-res renders before launch.
- [ ] **Google Maps.** The embed is a public search embed centred on Horamavu
      Lake. Replace with the exact site pin, or a Maps Embed API key, once the
      plot coordinates are confirmed.

## Performance & SEO notes

- `next/image` throughout with explicit `sizes`; `priority` only on the first
  hero frame
- Hero images rotate on a 6.5s crossfade, paused under `prefers-reduced-motion`
- Specifications and FAQ use native `<details>` — collapsed by default, but the
  text stays in the DOM for crawlers
- JSON-LD `RealEstateListing` + `Residence` + `FAQPage` in the page head. No
  `offers` node, because no price is published
- `robots.txt` and `sitemap.xml` generated from `NEXT_PUBLIC_SITE_URL`
- Analytics tags are opt-in: with the env vars unset, zero third-party JS loads
