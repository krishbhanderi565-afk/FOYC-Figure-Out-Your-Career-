# FOYC Responsive Testing & Device Matrix

## 1. Testing Breakpoints

FOYC was built mobile-first and tested across all standard viewport dimensions:

| Viewport Width | Device Category | Key Responsive Adjustments |
| :--- | :--- | :--- |
| **320px - 360px** | Small Mobile (iPhone SE, Galaxy A) | Single-column cards, condensed padding, wrap badges, full-width touch targets |
| **390px - 430px** | Standard Mobile (iPhone 14/15/16, Pixel 8) | Optimized header typography, bottom padding for touch comfort, smooth scroll |
| **768px - 820px** | Tablets / iPads | 2-column card grids, flexible top bar, side-by-side comparison tables |
| **1024px** | Small Laptops | Collapsible dashboard sidebar, full desktop navigation bar |
| **1366px - 1440px**| Modern Desktop | Maximum comfortable container width (`max-w-7xl`), multi-column dashboard layouts |

---

## 2. Verified Test Scenarios

1. **Horizontal Overflow Check:** `overflow-x: hidden` enforced on page wrapper; zero unintended horizontal scrolling across all tested viewports.
2. **Touch Target Size:** Minimum 44px x 44px for all mobile interactive buttons, tabs, and checkboxes.
3. **Typography Scaling:** Heading sizes dynamically scale from `text-3xl` (mobile) to `text-6xl` (desktop) with strict line-heights preventing text collisions.
4. **Interactive Drawers & Modals:** Mobile hamburger drawer slides in smoothly without trapping focus or obscuring content.
