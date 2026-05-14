# Mobile UX & Responsiveness — Handoff

## Summary

Comprehensive mobile responsiveness and touch-interaction improvements across 17 files. All changes use the existing pattern: `globals.css` media queries + inline styles + CSS class hooks on JSX elements. No new dependencies. No Tailwind. No CSS modules.

Commits: `a116266..f1530ab` (4 commits on `main`, ahead of `origin/main` by 1).

---

## Files Changed (17)

| File                                      | Lines | What changed                                                                                                                                                                                           |
| ----------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/globals.css`                     | +113  | Breakpoints, touch targets, overflow, utility classes, mobile layout rules                                                                                                                             |
| `src/components/NavbarMobile.tsx`         | ~1    | Removed inline `display: "none"` from ThemeToggle wrapper                                                                                                                                              |
| `src/components/NavbarClient.tsx`         | +1    | `maxWidth: "calc(100vw - 2rem)"` on user dropdown                                                                                                                                                      |
| `src/components/PluginSearch.tsx`         | ~1    | `width: "300px"` → `width: "100%"`                                                                                                                                                                     |
| `src/app/plugins/page.tsx`                | ~115  | Restructured card: stats moved inside content div, same row as version/author; author name truncates with ellipsis                                                                                     |
| `src/app/page.tsx`                        | ~110  | Same card restructure as plugins page                                                                                                                                                                  |
| `src/app/plugins/[slug]/page.tsx`         | +23   | Copy icon wrapped in `<button className="touch-target">`; description header gets `className="plugin-description-header"`                                                                              |
| `src/components/VersionSelector.tsx`      | +15   | Select + download buttons fill full width (`flex: 1`); CPP buttons wrap; version info gets `className="version-info-text"`                                                                             |
| `src/app/plugins/[slug]/builds/page.tsx`  | +1    | Table gets `className="builds-table"` for CSS card conversion                                                                                                                                          |
| `src/app/dashboard/dev/page.tsx`          | +10   | Stats grid `repeat(3,1fr)` → `repeat(auto-fit, minmax(140px,1fr))`; search/filter bar wraps; repo card inner/actions get class hooks; description `maxWidth` → `100%`; filter button padding increased |
| `src/app/dashboard/page.tsx`              | ~4    | Grid `minmax(240px,1fr)` → `minmax(min(240px,100%),1fr)`; same for `320px`                                                                                                                             |
| `src/components/PluginRatings.tsx`        | +7    | Star button padding `2px` → `6px`, size `18` → `22`; comment/reply indentation blocks get class hooks for mobile reduction                                                                             |
| `src/app/layout.tsx`                      | ~2    | Footer links container gets `className="footer-links"`                                                                                                                                                 |
| `src/components/LiveBuildLog.tsx`         | +3    | Header gets `className="live-build-header"` with `flexWrap` and `gap`                                                                                                                                  |
| `src/app/builds/[id]/page.tsx`            | +1    | Title row gets `className="build-title-row"`                                                                                                                                                           |
| `src/components/EditPluginForm.tsx`       | ~4    | Categories grid `minmax(200px,1fr)` → `minmax(min(200px,100%),1fr)`; license wrapper gets `className="license-select-wrapper"`                                                                         |
| `src/components/PluginAnalyticsChart.tsx` | +3    | Chart header gets `className="chart-header"` with `flexWrap` and `gap`                                                                                                                                 |

---

## What Changed — By Category

### Global CSS (`src/app/globals.css`)

- `html, body { overflow-x: hidden }` — prevents accidental horizontal scroll
- `.btn` and `.input` get `min-height: 44px` at `≤768px` (iOS HIG touch target)
- `.touch-target` utility: `min-height: 44px; min-width: 44px; display: inline-flex`
- `@media (max-width: 480px)` new small-phone breakpoint: tighter padding, reduced headings
- `.nav-links.open`: `position: absolute` → `position: fixed; top: 65px; bottom: 0; overflow-y: auto; max-height: calc(100vh - 65px)` — mobile menu now overlays full viewport and scrolls independently
- Nav link tap area: `var(--space-2)` → `var(--space-3)`
- New mobile CSS rules at `≤768px` for: `.footer-links`, `.plugin-description-header`, `.builds-table` (table→card), `.dev-repo-actions`, `.dev-search-filter`, `.dev-repo-card-inner`, `.cpp-download-buttons`, `.version-info-text`, `.build-title-row`, `.chart-header`, `.live-build-header`, `.rating-comment`/`.rating-reply`, `.license-select-wrapper button`

### Plugin Card Layout (`plugins/page.tsx`, `page.tsx`)

Stats (date, downloads, rating) moved from a separate sibling div into the same flex row as version/author, below the title. Uses `justify-content: space-between; flex-wrap: wrap`. Author name gets `overflow: hidden; text-overflow: ellipsis; whiteSpace: nowrap` to prevent long names from pushing stats away.

### Navbar

- **ThemeToggle visibility**: Removed `style={{ display: "none" }}` from the ThemeToggle wrapper in `NavbarMobile.tsx` so the theme button appears next to the hamburger on mobile.
- **Dropdown overflow**: `NavbarClient.tsx` dropdown gets `maxWidth: "calc(100vw - 2rem)"` to prevent off-screen on narrow viewports.

### Version Selector (`VersionSelector.tsx`)

- Select and download button(s) fill full available width via `flex: 1`
- CPP download buttons wrap with `flexWrap: "wrap"`, each button `flex: "1 1 auto"; minWidth: "120px"`
- Version info text gets class hook for mobile left-alignment

### Builds Table (`plugins/[slug]/builds/page.tsx`)

Table gets `className="builds-table"`. On `≤768px`, CSS converts it to stacked cards: `thead` hidden, each `tr` becomes a `flex-direction: column` card with padding and gap.

### Dev Dashboard (`dashboard/dev/page.tsx`)

- Stats grid: `repeat(3, 1fr)` → `repeat(auto-fit, minmax(140px, 1fr))`
- Search + filter bar: `flexWrap: "wrap"`, class hook for mobile stacking
- Repo card inner layout: class hook for mobile stacking
- Repo actions: class hook for mobile stacking
- Description `maxWidth: "500px"` → `"100%"`
- Filter button padding: `0.375rem` → `0.5rem` for 44px touch targets

### Dashboard Page (`dashboard/page.tsx`)

Grid `minmax` values wrapped with `min()` to prevent overflow on sub-320px screens:

- Stats: `minmax(240px, 1fr)` → `minmax(min(240px, 100%), 1fr)`
- Plugins: `minmax(320px, 1fr)` → `minmax(min(320px, 100%), 1fr)`

### Other Components

- **PluginRatings**: Star buttons `2px` → `6px` padding, `18` → `22` size; comment/reply indentation gets class hooks for mobile reduction
- **LiveBuildLog**: Header gets `flexWrap: "wrap"` and class hook
- **PluginAnalyticsChart**: Header gets `flexWrap: "wrap"` and class hook
- **Build Detail**: Title row gets class hook for `flex-wrap: wrap`
- **EditPluginForm**: Categories grid uses `min()` safe pattern; license button wrapper gets class hook for mobile repositioning
- **Footer**: Links container gets `className="footer-links"` for mobile vertical stacking

---

## Validation

All three checks pass:

```
npm run type-check  →  clean
npm run lint        →  no warnings or errors
npm run build       →  compiled successfully
```

---

## Viewport Testing Guide

Test at these widths (Chrome DevTools responsive mode):

| Width | Device                 | What to check                             |
| ----- | ---------------------- | ----------------------------------------- |
| 360px | Common Android         | Cards, nav menu, plugin detail            |
| 375px | iPhone SE              | Cards, search, builds table               |
| 390px | iPhone 14              | Full flow                                 |
| 414px | iPhone 14 Plus         | Full flow                                 |
| 480px | Small phone breakpoint | Tighter padding, smaller headings         |
| 768px | iPad portrait          | Sidebar hide, table→card, footer stacking |

---

## Known Limitations

- Plugin detail page (`plugins/[slug]`) is ~1065 lines and a server component — no `useState` for responsive logic, all mobile behavior is CSS-class-based.
- The `builds-table` card conversion on mobile hides `<thead>` so column labels are lost. Each `<td>` should ideally render its own label (e.g., via `::before` pseudo-element), but this was not implemented to keep changes minimal.
- The `@media (max-width: 480px)` breakpoint only adjusts padding and heading sizes. Further small-phone refinements may be needed based on real-device testing.
