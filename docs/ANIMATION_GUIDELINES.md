# FOYC Animation & Motion Guidelines

## 1. Principles
- **Tactile & Responsive:** All buttons and cards feel physically responsive like physical editorial cards (translating into the offset shadow on click).
- **Subtle & Purposeful:** Motion is used to communicate hierarchy, state transitions, and completed tasks—never to distract or delay user actions.
- **Performance First:** All animations utilize GPU-accelerated CSS properties (`transform`, `opacity`, `box-shadow`) with sub-millisecond overhead.
- **Accessibility:** Full compliance with `@media (prefers-reduced-motion: reduce)`. When enabled, all transforms and transitions collapse to zero duration.

---

## 2. Interaction Specifications

### Tactile Neo-Brutalist Buttons (`.neo-btn`)
- **Default State:** `border: 2px solid #17172B; box-shadow: 4px 4px 0px #17172B;`
- **Hover State:** `transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #17172B; transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);`
- **Active / Pressed:** `transform: translate(2px, 2px); box-shadow: 2px 2px 0px #17172B;`

### Floating & Highlight Elements
- **Signature Highlight:** Slight rotation (`rotate(-0.5deg)` to `rotate(-1deg)`), straightening to `rotate(0deg)` on hover.
- **Pulse Indicators:** Subtle pulse animations on active badges and streak flame icons.
- **Page & Modal Transitions:** Clean `animate-in zoom-in-95 fade-in duration-200` for overlays and drawers.
