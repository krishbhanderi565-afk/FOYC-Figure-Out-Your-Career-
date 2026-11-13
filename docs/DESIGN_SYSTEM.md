# FOYC Design System & Brand Identity

## 1. Brand Philosophy
- **Name:** FOYC (Figure Out Your Career)
- **Tagline:** *From Career Confusion to Career Clarity.*
- **Tone & Voice:** Welcoming, Intelligent, Modern, Creative, Trustworthy, Encouraging, Premium, Accessible.
- **Core Stance:** Non-judgmental guidance. Does not pigeonhole users into rigid categories or force immediate lifelong commitments. Iterative, living career roadmaps based on demonstrable proof of work.

---

## 2. Color Palette & Neo-Editorial Hierarchy

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Cream** | `#FFF8E9` | Primary page background, soft canvas warmth, prevents eye fatigue |
| **Warm Yellow** | `#FFE76B` | Primary CTA buttons, bold headline highlights, active badges |
| **Pastel Pink** | `#FFD9E8` | Empathy cards, problem exploration, milestone badges |
| **Pastel Blue** | `#D7EAFE` | Technical roadmaps, informational callouts, engineering tags |
| **Pastel Lavender**| `#E8DDFF` | Creative disciplines, adjacent options, curiosity badges |
| **Pastel Green** | `#DDF5C9` | Completion states, verified resources, consistency streaks |
| **Dark Navy** | `#17172B` | Bold oversized typography, 2px/3px borders, dark contrast sections |
| **Pure White** | `#FFFFFF` | Interactive card surfaces, contrast containers, modal backdrops |

---

## 3. Typography Rules

- **Display & Headings:** `Plus Jakarta Sans` / Editorial Sans with tight letter-spacing (`tracking-tight`, `-0.03em`) and heavy ink weight (`font-extrabold` / `font-black`).
- **Body & Captions:** `Plus Jakarta Sans` with comfortable line height (`leading-relaxed`, `font-medium`, `font-semibold`).
- **Signature Highlight Box:**
  ```html
  <span class="inline-block px-3 py-0.5 mx-1 font-extrabold text-[#17172B] rounded-lg border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] bg-[#FFE76B]">
    highlighted text
  </span>
  ```

---

## 4. Neo-Editorial Component Standards

### Cards & Containers
- **Border:** `2px solid #17172B` (or `3px` on hero frames)
- **Border Radius:** `12px` (inputs, buttons) to `24px` / `32px` (hero frames, modal dialogs)
- **Shadow Offset:**
  - Standard: `box-shadow: 4px 4px 0px #17172B`
  - Subtle / Small: `box-shadow: 2px 2px 0px #17172B`
  - High Impact: `box-shadow: 6px 6px 0px #17172B` or `8px 8px 0px #17172B`
- **Hover Micro-interaction:** `translate(-2px, -2px)` with shadow expansion to `6px 6px 0px #17172B`.
- **Active / Click:** `translate(2px, 2px)` with shadow contraction to `2px 2px 0px #17172B`.

---

## 5. Universal Personalization Tokens
- The design system powers every profession—Software Engineering, Applied AI, UX/UI Design, and Tech Entrepreneurship—using unified component geometry with dynamic content injection.
