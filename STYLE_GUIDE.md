# EndGit UI & Tailwind v4 Design System Style Guide

This document establishes the UI patterns, design system tokens, and Tailwind v4 usage guidelines for the **EndGit Web** project. Following these patterns ensures consistency, accessibility, and a premium look-and-feel across all pages.

---

## 1. Color Palette & Tokens

We use a curated, dark-mode first semantic color palette. Avoid hardcoded hex codes. Always use the predefined Tailwind CSS utility classes.

| Token Group | Tailwind Class | Light Hex | Dark Hex | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Brand (Primary)** | `bg-brand` / `text-brand` | `#0ea5e9` (Sky 500) | `#38bdf8` (Sky 400) | Primary branding, buttons, links, accents |
| | `bg-brand-light` | `#e0f2fe` (Sky 100) | `#0c4a6e` (Sky 900) | Accent backgrounds, badge fills |
| | `bg-brand-dark` | `#0284c7` (Sky 600) | `#0ea5e9` (Sky 500) | Hover states for primary buttons |
| **Surfaces** | `bg-surface` | `#f8fafc` (Slate 50) | `#000000` (Pure Black) | Core page background |
| | `bg-surface-secondary` | `#f1f5f9` (Slate 100) | `#0a0a0a` (Zinc 950) | Sidebar, navigation headers, footers |
| | `bg-surface-card` | `#ffffff` | `#121212` (Zinc 900) | Floating cards, panels, modals |
| **Text** | `text-text-primary` | `#0f172a` (Slate 900) | `#ffffff` | Headings, main readable body text |
| | `text-text-secondary` | `#475569` (Slate 600) | `#a1a1aa` (Zinc 400) | Secondary / supporting content |
| | `text-text-muted` | `#94a3b8` (Slate 400) | `#71717a` (Zinc 500) | Subtexts, timestamps, placeholders |
| **Semantic** | `text-success` | `#10b981` (Emerald 500) | `#10b981` (Emerald 500) | Success alerts, passed builds |
| | `text-error` | `#ef4444` (Red 500) | `#ef4444` (Red 500) | Error states, validation alerts |
| | `text-warning` | `#f59e0b` (Amber 500) | `#f59e0b` (Amber 500) | Star ratings, pending warnings |
| **Borders** | `border-border` | `#e2e8f0` (Slate 200) | `#27272a` (Zinc 800) | Standard divider borders, cards |
| | `border-border-highlight` | `#cbd5e1` (Slate 300) | `#3f3f46` (Zinc 700) | Focused or hovered borders |

---

## 2. Typography

We use **Inter** for UI copy and **Fira Code** for code and technical data.

- **Main Heading (H1)**: `text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary`
- **Section Heading (H2)**: `text-2xl font-bold tracking-tight text-text-primary`
- **Subsection Heading (H3)**: `text-xl font-semibold text-text-primary`
- **Body Text**: `text-base text-text-secondary leading-relaxed`
- **Small / Muted Copy**: `text-xs md:text-sm text-text-muted`
- **Code Block**: `font-mono text-sm bg-surface-secondary border border-border rounded-md px-2 py-1`

---

## 3. Elevation & Borders

### Border Radii
- **`rounded-xs` (4px)**: Tiny controls, inline tag shapes.
- **`rounded-sm` (6px)**: Small buttons, small badges, inline checkboxes.
- **`rounded-md` (10px)**: Default button sizes, input controls, small boxes.
- **`rounded-lg` (14px)**: Default card layouts, sidebar menus, navigation panes.
- **`rounded-xl` (18px)**: Dialog frames, large floating dashboards.

### Shadows
- **`shadow-xs`**: Inline buttons or flat border shapes.
- **`shadow-sm`**: Base page layout items.
- **`shadow-md`**: Standalone cards or dropdown boxes.
- **`shadow-lg`**: Modal overlays and floating options panes.

---

## 4. Component Standards

### Buttons
Buttons should be clean, interactive, and utilize standard transitions:
```tsx
// Primary Button
<button className="px-4 py-2 bg-text-primary text-surface font-medium rounded-sm shadow-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-all">
  Action Name
</button>

// Secondary / Bordered Button
<button className="px-4 py-2 bg-surface-card text-text-primary border border-border font-medium rounded-sm shadow-sm hover:bg-surface-secondary hover:border-border-highlight transition-all">
  Secondary Action
</button>
```

### Form Fields
Always structure form controls with accessible headers and outline focus frames:
```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-semibold text-text-secondary">Input Label</label>
  <input 
    type="text" 
    placeholder="Enter value..." 
    className="w-full bg-surface-card border border-border text-text-primary px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-text-muted"
  />
</div>
```

---

## 5. Responsive Breakpoints

We design mobile-first:
- **Mobile (< 768px)**: Grid structures collapse to a single column, headers centered.
- **Tablet (768px - 1024px)**: Two-column grid layouts, menu drawers collapsed into mobile buttons.
- **Desktop (1024px+)**: Multicolumn structures, sidebar side-by-side grids, and complete navigation panels.

---

## 6. Accessibility & Animations
- **Reduced Motion**: All custom CSS animations (`fade-in`, `fade-slide-up`, `shimmer`) must respect `@media (prefers-reduced-motion: reduce)` which Tailwind handles seamlessly via standard browser config.
- **Click targets**: Guarantee interactive buttons are minimum `44px` high on mobile (or use padding extensions).
- **Focus Indicators**: Focusable controls must have `focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2`.
