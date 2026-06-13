# Monthsary Parallax Gift — Project Plan

> Living document for tracking the gift build. Update this as decisions are made.

**Last updated:** June 12, 2026  
**Status:** Phase 3 — Mountain Dusk scene built, awaiting message + photo  
**Chosen theme:** Mountain Dusk / Super Mountain Dusk (official beach demo = motion/feel reference only)

---

## Quick reference

| Item | Detail |
|------|--------|
| **Project folder** | `parallax/` |
| **Dev server** | `npm start` → http://localhost:9000/monthsary.html |
| **Gift page** | `parallax/examples/pages/monthsary.html` |
| **Styles** | `parallax/examples/assets/monthsary.scss` → `monthsary.css` |
| **Photo drop-in** | `parallax/examples/assets/images/monthsary/photo.jpg` |
| **Mountain layers** | `parallax/examples/assets/images/monthsary/scene/{super-b,godot,super-c}/` |
| **Message text** | Edit `#message-text` in `monthsary.html` when ready |
| **Built JS (for deploy)** | `parallax/dist/parallax.min.js` |
| **Visual reference (motion/vibe)** | https://matthew.wagerfield.com/parallax/ |

---

## Theme decision

**What we want:** The same *feeling* as the official beach demo — full-screen, dreamy, slow parallax depth, immersive on phone tilt — but the **scene is a starry night**, not a coast.

**What we are NOT doing:** Copying the beach artwork or rebuilding the entire official demo site (ropes, lighthouse CSS sprites, etc.). That site is a separate, much larger design. We borrow the **experience**, not the assets.

**Aesthetic direction:** Soft romantic night sky (deep navy → purple gradient, glowing moon, layered stars, maybe horizon silhouettes). *Not* a literal Van Gogh painting clone — more “looking up at the sky together” than art museum.

---

## Scene design — layer breakdown

Think of it like the beach demo: many depth planes, back moves little, front moves more.  
All layers are **320×240 native** pixel art, scaled to a bottom-anchored 4:3 stage. Black areas use `mix-blend-mode: lighten` to key out against the sky.

### Active layers in `monthsary.html` (back → front)

| # | depth | Role | Pack | Asset file |
|---|-------|------|------|------------|
| — | *(fixed)* | Sky base (not parallax) | **super-b** | `scene/super-b/sky.png` |
| 1 | `0.05` | Far clouds | **godot** *(Mountain Dusk A)* | `scene/godot/far-clouds.png` |
| 2 | `0.20` | Far mountains | **godot** | `scene/godot/far-mountains.png` |
| 3 | `0.35` | Middle mountains | **super-b** *(Super Mountain Dusk B)* | `scene/super-b/middle-mountains.png` |
| 4 | `0.50` | Near clouds | **godot** | `scene/godot/near-clouds.png` |
| 5 | `0.62` | Myst / haze | **super-b** | `scene/super-b/myst.png` |
| 6 | `depth-x 0.78` / `depth-y 0.92` | Back trees + polaroid #1 | **super-b** | `scene/super-b/far-trees.png` |
| 7 | `depth-x 0.88` / `depth-y 0.92` | Mid trees + polaroids #2–3 | **godot** | `scene/godot/trees.png` |
| 8 | `depth-x 1.00` / `depth-y 0.92` | Front trees + polaroids #4–5 | **super-b** | `scene/super-b/near-trees.png` |

**Parallax settings (current):** `friction 0.08`, `scalar 22`, `limit 55`, `relative-input true`

**HTML overlays (not PNG layers):**

| Element | Notes |
|---------|-------|
| `tap to reveal` button | Top center — opens message card |
| Message card | “Happy 4th Monthsary, Joan Lucille” + your message |
| 5 polaroids | Scattered in tree rows; all use `photo.jpg` via CSS |

---

### Available asset packs (on disk, not all used yet)

Paths under `parallax/examples/assets/images/monthsary/scene/`

#### `godot/` — Mountain Dusk (Version A)

| File | Used in scene? |
|------|----------------|
| `sky.png` | No *(sky comes from super-b)* |
| `far-clouds.png` | Yes — layer 1 |
| `far-mountains.png` | Yes — layer 2 |
| `mountains.png` | No |
| `near-clouds.png` | Yes — layer 4 |
| `trees.png` | Yes — layer 7 |

#### `super-b/` — Super Mountain Dusk (Version B)

| File | Used in scene? |
|------|----------------|
| `sky.png` | Yes — fixed background |
| `far-mountains.png` | No *(godot far-mountains used instead)* |
| `middle-mountains.png` | Yes — layer 3 |
| `myst.png` | Yes — layer 5 |
| `far-trees.png` | Yes — layer 6 |
| `near-trees.png` | Yes — layer 8 |

#### `super-c/` — Super Mountain Dusk (Version C, wide / zoomed-out)

| File | Used in scene? |
|------|----------------|
| `sky.png` | No |
| `far-mountains.png` | No |
| `canyon.png` | No |
| `clouds.png` | No |
| `front.png` | No |

*Version C is the widest vista — candidate for a future “zoom in” outer scene.*

#### Other assets

| File | Role |
|------|------|
| `photo.jpg` | Polaroid photos (user-provided) |
| `rope.png` | Unused (from earlier rope experiment) |

### Color palette (starting point)

| Use | Color |
|-----|-------|
| Sky top | `#0a0e27` |
| Sky bottom / horizon glow | `#1a1040` → `#2d1b4e` |
| Stars | `#fff` / soft `#ffe9c0` |
| Moon | `#fff8e7` with outer glow |
| Accent (hearts, text highlight) | `#c9a0ff` or soft gold `#f0d9a8` |
| Silhouette | `#050510` |

### Motion tuning (match beach “dreamy” feel)

| Setting | Planned value | Why |
|---------|---------------|-----|
| `friction` | `0.06` – `0.08` | Slow, floaty drift (beach demo uses ~0.1) |
| `scalar` | `12` – `18` | Noticeable but not dizzying |
| `relativeInput` | `true` | Movement feels tied to cursor position on screen |
| `hoverOnly` | `false` | Always alive, like the beach demo |

---

## Page experience (user journey)

### Recommended flow for v1

```
[She opens link]
       ↓
[Full-screen starry night loads]
       ↓
[Parallax already active — tilt phone / move mouse]
       ↓
[Title + monthsary line visible in the scene]
       ↓
[Optional: tap a subtle “♥” or moon to reveal 2–3 sentence message]
```

### Optional upgrades (v2 — only if we want later)

- Intro screen: black → “Tap to open” → scene fades in
- Soft background music + mute button
- `onReady` callback: message fades in after parallax calibrates
- CSS twinkle animation on a few stars (subtle, not disco)

**v1 keeps it simple:** one page, immediate wow, readable message, no extra taps required unless you want the reveal.

---

## Build approach (technical — for when we code)

### Strategy: “Rich simple” (recommended)

Start from `simple.html` pattern, not the full official demo codebase.

| Piece | How |
|-------|-----|
| New HTML page | `monthsary.html` — keeps `simple.html` intact as reference |
| Layout | Full viewport, no `max-width: 600px` box |
| Parallax | Same library, tuned `friction` / `scalar` / depths |
| Sky | CSS gradient on `body` + PNG star layers on top |
| Message | HTML + CSS overlay (easy to edit your words later) |
| Styles | Separate `monthsary.scss` or section in styles — avoid breaking other examples |
| Dev server | Point `startPath` to `monthsary.html` when we build |

### Why not clone the official beach site?

The beach demo uses dozens of custom CSS classes, sprite graphics, ropes, waves, and a toggle UI. Porting that for stars would take much longer and be harder for you to edit. The **simple layered model** gives 90% of the magic with 10% of the complexity.

---

## Assets — what we need before / during build

### Must have (v1)

- [ ] **Her name** (for title)
- [ ] **Monthsary number or date** (e.g. “4th monthsary” / “June 11”)
- [ ] **Short message** (1–3 sentences — you write the real one later; placeholder OK for dev)
- [ ] **Layer images** — see options below

### Nice to have

- [ ] One photo of you two
- [ ] A song file (mp3) or link to “your song”
- [ ] Target date to send the link
- [ ] Inside joke or place name to hide in the scene

### How to get layer images (pick one path)

| Option | Pros | Cons |
|--------|------|------|
| **A. You create in Canva / Photopea** | Most personal, full control | Takes your time |
| **B. AI-generated layers** | Fast, cohesive set | May need cleanup; you approve each layer |
| **C. Code-first MVP** | Fastest to see motion — CSS sky + simple star PNGs we generate | Less “illustrated,” more minimal |
| **D. Stock / free illustration packs** | Polished look | Less unique; license check needed |

**Suggested path:** Start with **C** to validate motion and layout → swap in **A or B** art when ready. You see something beautiful quickly; we upgrade art without redoing code.

---

## Phase checklist (updated)

### Phase 0 — Explore ✅

- [x] Fix `npm install` / dev server
- [x] Confirm parallax works locally
- [x] User viewed official beach demo (vibe reference)
- [x] Theme chosen: **starry night**

### Phase 1 — Creative direction ✅

| # | Question | Answer |
|---|----------|--------|
| 1 | Theme / vibe | **Starry night** — romantic, dreamy, full-screen |
| 2 | Her name | **Joan Lucille** |
| 3 | Monthsary # / date | **4th Monthsary** |
| 4 | Tone | Soft & romantic |
| 5 | Background music? | **Skip for now** |
| 6 | Include a photo? | **Yes** — user will provide `photo.jpg` |
| 7 | Message reveal | **Tap to reveal** (tap the moon) |
| 8 | Asset source | **C (CSS MVP)** first → upgrade to A or B later |
| 9 | Message copy | _User will provide after MVP review_ |

### Phase 2 — Assets

- [ ] Confirm layer approach (CSS + PNG mix)
- [ ] Create / gather 4–6 night layer PNGs (or approve AI set)
- [ ] Write final message text
- [ ] Choose font mood (soft serif vs clean sans)
- [ ] Optional: photo, music, favicon

### Phase 3 — Build (MVP done)

- [x] Create `monthsary.html`
- [x] Create `monthsary.scss` (CSS sky, stars, moon, silhouette)
- [x] Wire starry layer stack + depths
- [x] Title overlay: “Happy 4th Monthsary, Joan Lucille”
- [x] Tap moon → reveal message card (placeholder text)
- [x] Polaroid photo slot + placeholder state
- [x] Tune parallax (friction 0.07, relative input)
- [x] Dev server opens `monthsary.html`
- [ ] User adds final message text
- [ ] User adds `photo.jpg`
- [ ] Optional: upgrade art (path A or B)

### Phase 4 — Test

- [ ] Desktop mouse
- [ ] Phone tilt (same WiFi + HTTPS after deploy)
- [ ] iOS motion permission if needed
- [ ] Readability on small screens
- [ ] Performance (image sizes reasonable)

### Phase 5 — Deploy

- [ ] Netlify / Vercel / GitHub Pages
- [ ] HTTPS live link
- [ ] Final phone test before sending

---

## Draft layout (wireframe)

```
┌─────────────────────────────────────┐
│  ✦  ·    ✦      ·   ✦    ·  ✦     │  ← layer 2: bright stars (depth 0.70)
│        🌙                           │  ← layer 3: moon (0.50)
│   ·    ✦   ～ nebula ～   ✦   ·    │  ← layer 4: haze (0.30)
│  ·   ✦   ·   ✦   ·   ✦   ·  ✦  ·  │  ← layer 5: distant stars (0.15)
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← layer 1: silhouette (0.90)
│                                     │
│     Happy 4th Monthsary, Name       │  ← HTML text overlay
│        ·  ✦  ·  ✦  ·  ✦  ·         │
│         [ optional short message ]  │
└─────────────────────────────────────┘
         gradient sky (depth 0.00)
```

---

## Parallax tuning cheatsheet

```html
<div id="scene"
  data-friction-x="0.07"
  data-friction-y="0.07"
  data-scalar-x="15"
  data-scalar-y="12"
  data-relative-input="true">
```

- `data-depth="0.00"` → barely moves (sky)
- `data-depth="0.90"` → moves most (silhouette / foreground)

---

## Notes & ideas log

| Date | Note |
|------|------|
| 2026-06-11 | Repo fixed for Node 24; local demo uses placeholder shapes |
| 2026-06-11 | Official beach = motion/vibe reference only |
| 2026-06-11 | **Theme locked: starry night** — plan before code |
| 2026-06-11 | Build strategy: `monthsary.html` + layered PNGs + CSS sky, not full beach port |
| 2026-06-11 | Phase 1 locked: Joan Lucille, 4th Monthsary, tap-to-reveal, photo later, no music |
| 2026-06-11 | MVP built: CSS starry night + polaroid slot + moon tap reveal |
| 2026-06-11 | Fixed tap-to-reveal (fixed overlay button); title moved to letter card |
| 2026-06-11 | Added diorama hills (4 depth layers) + rope clouds/birds with swing anim |
| 2026-06-11 | Integrated Mountain Dusk + Super Mountain Dusk assets (17 parallax layers) |

---

## Open questions (remaining)

1. **Final message text** — user to provide after reviewing MVP
2. **Photo** — drop `photo.jpg` in `examples/assets/images/monthsary/`
3. **Art upgrade** — when ready, replace CSS layers with illustrated PNGs (path A or B)?

---

## Session checklist for AI / dev

When resuming:

1. Check if `photo.jpg` exists
2. Check if `#message-text` still has placeholder copy
3. Read `monthsary.html` + `monthsary.scss` for current state
4. Phase 4 testing / Phase 5 deploy when user is happy with look + copy
