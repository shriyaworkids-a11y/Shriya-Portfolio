# Design-System Crosswalks (Curated)

Concrete role mappings for the most-requested design systems, applying the [Interop Protocol](file:///f:/AI-Project/.agents/skills/design-systems/interop-protocol.md). Map by **role/intent**, never merely by literal token name.

---

## 1. Color-Role Crosswalk (The Universal Spine)

| Our Semantic Role | Material 3 | Apple HIG | Fluent 2 | Carbon | shadcn/ui | Radix Colors |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `action.primary` | `primary` | `tintColor` / accent | `brand` / `accent` | `interactive` / `$button-primary` | `--primary` | Step `9` (solid) |
| `action.primary-hover` | `primary` + state layer | accent (pressed) | `brand hover` | `$button-primary-hover` | `--primary` (hover) | Step `10` |
| `on-action` (text on primary) | `onPrimary` | label-on-accent | `text-on-accent` | `$text-on-color` | `--primary-foreground` | Contrast step `12`/`1` |
| `surface.page` | `surface` / `background` | systemBackground | `neutralBackground1` | `$background` | `--background` | Step `1`/`2` |
| `surface.card` | `surfaceContainer` | secondarySystemBackground | `neutralBackground2` | `$layer` | `--card` | Step `2`/`3` |
| `border.default` | `outlineVariant` | separator | `neutralStroke2` | `$border-subtle` | `--border` | Step `6` |
| `border.strong` | `outline` | opaqueSeparator | `neutralStroke1` | `$border-strong` | `--input` | Step `7`/`8` |
| `text.primary` | `onSurface` | label | `neutralForeground1` | `$text-primary` | `--foreground` | Step `12` |
| `text.secondary` | `onSurfaceVariant` | secondaryLabel | `neutralForeground2` | `$text-secondary` | `--muted-foreground` | Step `11` |
| `feedback.error` | `error` | systemRed | `dangerForeground` | `$support-error` | `--destructive` | `red` step `9` |
| `feedback.success` | `tertiary` / custom | systemGreen | `successForeground` | `$support-success` | custom | `green` step `9` |
| `focus-ring` | `primary` outline | focusRing / keyboard | `strokeFocus` | `$focus` | `--ring` | Step `8` (focus) |

> **Note on State Layers**: Material 3 conveys hover/press via **state layers** (opacity overlays) rather than separate discrete hex values. Map `-hover`/`-active` tokens to the equivalent state-layer opacity.

---

## 2. Structural & Spatial Axes

| Axis | Material 3 | Apple HIG | Fluent 2 | Carbon | shadcn/ui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Base Grid** | 4dp | 8pt (4pt half-steps) | 4px | 8px (2x grid) | 4px (Tailwind) |
| **Type Ramp** | Display / Headline / Title / Body / Label | Large Title → Caption (SF Pro) | Display → Caption | Productive / Expressive | Tailwind text-* |
| **Corner Radius** | xs–xl (`shape`) | Continuous-corner (~8–14pt) | `borderRadius` 3–8px | 0–8px (sharp-leaning) | `--radius` (0.5rem default) |
| **Elevation** | dp tonal + shadow (0–5) | Thin shadows / materials | Depth 4 / 8 / 16 / 64 | `01–05` boxshadow | `shadow-sm…lg` |

---

## 3. Extended Crosswalks (Ant · Polaris · Primer · Atlassian · Bootstrap)

| Our Semantic Role | Ant Design 5 | Shopify Polaris | GitHub Primer | Atlassian (ADS) | Bootstrap 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `action.primary` | `colorPrimary` | `--p-color-bg-fill-brand` | `--button-primary-bgColor-rest` / `accent.fg` | `color.background.brand.bold` | `--bs-primary` |
| `action.primary-hover` | `colorPrimaryHover` | `…bg-fill-brand-hover` | `…bgColor-hover` | `…brand.bold.hovered` | `--bs-primary` + `:hover` |
| `on-action` | `colorTextLightSolid` | `--p-color-text-brand-on-bg-fill` | `--button-primary-fgColor-rest` | `color.text.inverse` | `--bs-btn-color` (`#fff`) |
| `surface.page` | `colorBgLayout` | `--p-color-bg` | `--bgColor-default` / `canvas.default` | `color.background.surface` | `--bs-body-bg` |
| `surface.card` | `colorBgContainer` | `--p-color-bg-surface` | `--bgColor-muted` / `canvas.subtle` | `color.background.surface.raised` | `--bs-card-bg` |
| `border.default` | `colorBorderSecondary` | `--p-color-border` | `--borderColor-muted` | `color.border` | `--bs-border-color` |
| `border.strong` | `colorBorder` | `--p-color-border-strong` | `--borderColor-default` | `color.border.bold` | `--bs-border-color` (darker) |
| `text.primary` | `colorText` | `--p-color-text` | `--fgColor-default` / `fg.default` | `color.text` | `--bs-body-color` |
| `text.secondary` | `colorTextSecondary` | `--p-color-text-secondary` | `--fgColor-muted` | `color.text.subtle` | `--bs-secondary-color` |
| `feedback.error` | `colorError` | `--p-color-text-critical` | `--fgColor-danger` / `danger.fg` | `color.text.danger` | `--bs-danger` |
| `feedback.success` | `colorSuccess` | `--p-color-text-success` | `--fgColor-success` / `success.fg` | `color.text.success` | `--bs-success` |
| `focus-ring` | `colorPrimaryBorder` (+ outline) | `--p-color-border-focus` | `--focus-outlineColor` / `accent.emphasis` | `color.border.focused` | `--bs-focus-ring-color` |

---

## 4. Per-System Implementation Notes

- **Material Design 3 (Google)**: Tokens are role-based and dynamic-color driven. Map semantics to MD3 roles. For dynamic color, treat MD3's tonal palettes as primitives and semantic tokens as the role layer.
- **Apple HIG (iOS/macOS)**: Uses semantic system colors (`systemBackground`, `label`, `secondaryLabel`, `tintColor`) that automatically respond to light/dark/contrast modes. Respect Dynamic Type curves.
- **Fluent 2 (Microsoft)**: Heavy on neutral scales with brand ramps and depth tokens (`neutralBackground1..6`). Strong contrast accessibility.
- **Carbon (IBM)**: Built for high-density enterprise interfaces. Strict 2x 8px grid, sharp radii, role-based tokens (`$layer`, `$field`, `$border-subtle`).
- **shadcn/ui & Tailwind**: CSS variable mapping (`:root` / `.dark`). Best low-friction pairing for modern web apps because components accept standard CSS custom properties directly.
- **GitHub Primer**: Uses functional custom properties (`--fgColor-*`, `--bgColor-*`). Themed with `data-color-mode` and `data-dark-theme`.
- **Shopify Polaris**: Admin/commerce density. Uses `--p-color-*` and `--p-space-*` variables wrapped in `AppProvider`.
- **Atlassian Design System (ADS)**: Intent-driven naming (`color.background.brand.bold`). Near 1:1 mapping with modern semantic design token structures.
- **Bootstrap 5**: Theming via CSS variables (`--bs-*`) and Sass variables. Always supplement focus rings and disabled/loading contrast which default themes leave thin.
