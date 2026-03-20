

## Analysis: frederic.ooo Design Language

Key traits from the reference site:

- **Clean white/light gray background** -- no gradients, no glows, no ornamental layers
- **Single-column layout**, content left-aligned within a centered container (~700px max)
- **Lowercase headings**, small bold section titles (e.g. "latest experience", "open source")
- **System-like sans-serif font** (likely Inter or similar), no serif/display fonts
- **Minimal color palette**: dark gray text (#1a1a2e-ish), light gray secondary text, no accent color splashes -- monochrome with maybe one subtle blue-gray
- **No cards with borders/shadows** for list items -- just clean rows with subtle spacing
- **Company logos** as small square icons next to experience entries
- **Pill badges** for skills (thin border, no fill)
- **No hero banner images**, no background effects, no floating animations
- **Generous whitespace**, content breathes
- **Footer**: minimal, just a line and links

## Plan: Restyle the Site

### 1. Overhaul Color Palette & Typography (`src/index.css`)

- **Light mode**: pure white background (`0 0% 100%`), near-black foreground (`220 14% 10%`), light gray cards (`220 14% 98%`). Remove warm parchment/ember/gold tones.
- **Dark mode**: true dark (`220 14% 4%`), light text (`220 14% 93%`). Remove ember washes and brass accents.
- **Primary**: subtle blue-gray or neutral (`220 14% 30%`) instead of ember orange. No gradient text.
- **Remove**: `--gold`, `--glow`, `--wine`, `--olive`, gradient variables, ember/brass background images.
- **Font**: Keep Inter as sole font. Remove Playfair Display import and `font-display` usage. All headings use Inter.
- **Headings**: lowercase-feeling, medium weight, tighter -- not display serif.
- **Shadows**: flatten to minimal (just subtle `0 1px 3px rgba(0,0,0,0.06)` for elev-1, slightly more for elev-2). Remove ember shadows.

### 2. Simplify Hero (`src/components/Hero.tsx`)

- Remove all background gradient layers, glow divs, grid pattern, specular sheen
- Remove banner image carousel entirely
- Left-align content within centered container (matching frederic.ooo's left-aligned intro)
- Lowercase name display, clean tagline beneath
- Keep social links as small icons in a row
- Keep theme/language toggles but simplify their wrapper
- Remove scroll-down arrow animation
- Remove CTA buttons (or simplify to just subtle text links)

### 3. Simplify Section Components

**About (`About.tsx`)**: Remove card grid with icons. Replace with a simple paragraph block, no cards. Remove "label" / colored uppercase tags.

**Skills (`Skills.tsx`)**: Keep badge layout but use thin-border pill style (no fill), matching frederic.ooo's tag style.

**Experience (`Experience.tsx`)**: Remove timeline with dots and alternating layout. Use simple stacked list -- each entry is company name (bold), period (right-aligned), role description. No cards, just clean rows separated by subtle lines.

**Dashboard (`Dashboard.tsx`)**: Keep but simplify card styling to match flatter aesthetic. Remove heavy shadows.

**Hockey (`Hockey.tsx`)**: Simplify to clean list format, no heavy card styling.

**Books (`Books.tsx`)**: Keep but tone down visual flair.

**Contact (`Contact.tsx`)**: Simplify to just text + email link, no card wrapper. Clean and minimal.

**Footer (`Footer.tsx`)**: Thin top border, minimal layout with social icons.

### 4. CV Page (`src/pages/CV.tsx`)

- Apply same flattened card style
- Remove display font references
- Section headers: simple bold text with no decorative line

### 5. Tailwind Config (`tailwind.config.ts`)

- Remove `font-display` family
- Remove custom background images (ember-wash, brass-kiss, surface-sheen)
- Simplify shadow tokens

### 6. Update Card Component (`src/components/ui/card.tsx`)

- Reduce border/shadow to minimal defaults

### Files to Edit

1. `src/index.css` -- color palette, remove gradients, remove Playfair import
2. `tailwind.config.ts` -- remove display font, custom bg images, simplify shadows
3. `src/components/Hero.tsx` -- strip decorative layers, simplify layout
4. `src/components/About.tsx` -- clean paragraph style
5. `src/components/Skills.tsx` -- pill badges with border only
6. `src/components/Experience.tsx` -- flat list, no timeline
7. `src/components/Contact.tsx` -- minimal text block
8. `src/components/Footer.tsx` -- clean up
9. `src/components/Dashboard.tsx` -- flatten card styles
10. `src/components/Hockey.tsx` -- flatten
11. `src/components/Books.tsx` -- tone down
12. `src/pages/CV.tsx` -- apply clean style
13. `src/components/ui/card.tsx` -- minimal shadow/border

