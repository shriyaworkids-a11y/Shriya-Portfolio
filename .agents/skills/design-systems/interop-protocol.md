# Design-System Interop Protocol

Map this token system **to or from** any external design system — Material Design 3, Apple HIG, Fluent, Carbon, Ant, Polaris, Primer, Radix, shadcn/ui, Chakra, Mantine, Bootstrap, or a bespoke brand system. This is a *method*, not one file per system. Curated concrete crosswalks for the most common targets live in [`crosswalk.md`](file:///f:/AI-Project/.agents/skills/design-systems/crosswalk.md); reference specifications for major design system archetypes live in [`catalog.md`](file:///f:/AI-Project/.agents/skills/design-systems/catalog.md).

> **Goal**: Adopt, migrate, or bridge — without a rewrite. You produce a **mapping**, then optionally a thin **bridge layer**, then **verify** nothing regressed (especially contrast and states).

---

## The Crosswalk Method

For any system, map these six axes. Match by **role/intent**, not by name.

| Axis | Our side | What to find in the other system |
|------|----------|----------------------------------|
| **Color roles** | `semantic.action.*`, `surface.*`, `text.*`, `feedback.*` | Their primary/secondary, surface/background, on-color, error/warning/success roles |
| **Type scale** | `tokens/typography.json` (Major Third) | Their type ramp / "type scale" / text styles — map by step, not px |
| **Spacing unit** | 4px base scale | Their base unit (4dp/8dp grids common) — convert by ratio |
| **Radius** | `tokens/borders.json` | Their shape/corner scale |
| **Elevation** | `tokens/shadows.json` (5 levels) | Their elevation/shadow tiers (Material: dp; Fluent: depth) |
| **Motion** | `tokens/motion.json` | Their duration/easing tokens |

Output a table: *our token → their token → value note*. Flag any role they have that we don't (and vice-versa) as a gap to decide on.

---

## Directions

### A. Map FROM an external system → our tokens (adopt their look)
1. Pull their published tokens (or read the relevant catalog archetype in [`catalog.md`](file:///f:/AI-Project/.agents/skills/design-systems/catalog.md)).
2. Re-point our **semantic** tokens to their values (primitives stay; see dark mode strategy).
3. Keep our **component** token structure — only the resolved values change.
4. Verify contrast/state coverage (below).

### B. Map TO an external system → our components on their foundation (adopt their stack)
1. Identify their component primitives (e.g., Radix unstyled, shadcn copy-in, MUI components).
2. Apply our token values as their theme (their `ThemeProvider` / CSS vars / config).
3. Keep our 8-state + a11y requirements; fill any state they omit.

### C. Migrate between systems (replace one with another)
**Audit → Map → Bridge → Verify:**
1. **Audit** — inventory the current system's tokens + components in the codebase.
2. **Map** — build the crosswalk table; mark 1:1, approximate, and missing.
3. **Bridge** — introduce a compatibility layer that aliases old names to new tokens, so migration is incremental, not big-bang. Deprecate aliases over time.
4. **Verify** — migrate screen-by-screen behind the bridge.

---

## Headless vs. Styled Targets

- **Headless (Radix, Headless UI, Ark, React Aria)**: They provide behavior + a11y; you provide *all* styling from our tokens. Best fit — least conflict.
- **Copy-in (shadcn/ui)**: Components live in your repo; re-skin their Tailwind classes to our CSS-var tokens directly. See [`crosswalk.md`](file:///f:/AI-Project/.agents/skills/design-systems/crosswalk.md).
- **Styled libraries (MUI, Ant, Chakra, Mantine, Bootstrap)**: Theme via their config object/CSS vars; accept their component API, override tokens. Watch for opinionated defaults that fight our spacing/radius — override globally.

---

## Verification Checklist (Every Interop)
- **Contrast**: Re-check every mapped color pair against WCAG standards (4.5:1 normal text, 3:1 UI components and large text). A brand value that fails must be adjusted — taste never overrides POUR (Perceivable, Operable, Understandable, Robust).
- **State Coverage**: Confirm the target renders all applicable states:
  1. Default (Rest)
  2. Hover
  3. Active / Pressed
  4. Focus-Visible (Keyboard focus outline)
  5. Disabled
  6. Loading / Busy
  7. Selected / Checked
  8. Error / Invalid
- **Dark Mode**: Verify the mapping swaps correctly at the semantic layer (e.g. `[data-theme="dark"]`).
- **Density & Viewports**: Confirm tokens scale gracefully from mobile to desktop.
- **Visual + Functional Spot-Check**: Validate each migrated screen before signing off.
