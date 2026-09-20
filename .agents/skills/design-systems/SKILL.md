---
name: design-systems
description: Use when selecting, auditing, mapping, adopting, migrating, or integrating design systems (such as Material Design 3, Apple HIG, Fluent, Carbon, Ant, shadcn/ui, Radix, Tailwind, Bootstrap, etc.) and translating tokens across visual roles, typography, spacing, elevation, or component architectures.
---

# Design Systems Skill

## Overview

The **design-systems** skill provides a standardized, role-based interop framework to select, bridge, migrate, or adapt design tokens and component systems without fragile big-bang rewrites. It maps visual foundations across six core axes: **Color Roles**, **Type Scale**, **Spacing Unit**, **Corner Radius**, **Elevation**, and **Motion**.

Supporting Reference Documents:
- **[Interop Protocol](file:///f:/AI-Project/.agents/skills/design-systems/interop-protocol.md)**: The end-to-end methodology for bidirectional mapping, bridge layers, and verification.
- **[Crosswalk Reference](file:///f:/AI-Project/.agents/skills/design-systems/crosswalk.md)**: Curated concrete token tables for Material 3, Apple HIG, Fluent 2, Carbon, shadcn/ui, Radix, Ant Design, Polaris, Primer, Atlassian ADS, and Bootstrap 5.
- **[Catalog & Archetypes](file:///f:/AI-Project/.agents/skills/design-systems/catalog.md)**: Index of design archetypes (Modern Dark, Clean Enterprise, Premium Editorial).

---

## When to Use
- Translating Figma design tokens or screen layouts into code tokens ([Rule 05: Design System Telemetry](file:///f:/AI-Project/.agents/rules/05-design-system-telemetry.md) or CSS custom properties).
- Evaluating which external design system or component library (shadcn, Radix, Carbon, Material) best aligns with product requirements.
- Bridging or migrating an existing UI from one component library to another without visual regressions.
- Setting up semantic tokens for theming, multi-mode (light/dark), or accessibility compliance.

## When NOT to Use
- One-off isolated bug fixes (e.g. correcting a single typo in a button label).
- Pure backend logic, state machines, or database schema changes that have no UI or token implications.
- Ad-hoc styling that bypasses design system tokens (never hardcode arbitrary hex codes).

---

## The 6-Axis Crosswalk Methodology

Always match by **role and semantic intent**, never simply by matching literal string names.

| Axis | System Intent | Mapping Strategy |
| :--- | :--- | :--- |
| **1. Color Roles** | Primary, Surface, Background, Border, Feedback, Text | Map semantic roles (`action.primary`, `surface.card`, `text.secondary`) rather than raw hex. |
| **2. Type Scale** | Display, Headline, Title, Body, Caption | Map step-by-step ratio curves (e.g., Major Third), not rigid pixel heights. |
| **3. Spacing Unit** | Padding, margin, gap rhythm | Convert by base grid ratio (e.g. 4px base vs 8px base). |
| **4. Corner Radius** | Structural personality | Map sharp (0-2px), restrained (4-8px), or pill/rounded shapes. |
| **5. Elevation** | Visual z-index hierarchy | Tonal surface layers, subtle borders, or box-shadow tiers. |
| **6. Motion** | Durations and easing functions | Micro-interactions (100-200ms) vs entrance transitions (250-350ms). |

---

## Interop Workflows

### Direction A: Map FROM External System → Local Tokens
1. Inspect the source system (via [`catalog.md`](file:///f:/AI-Project/.agents/skills/design-systems/catalog.md) or external specs).
2. Populate the local semantic tokens ([Rule 05: Design System Telemetry](file:///f:/AI-Project/.agents/rules/05-design-system-telemetry.md) or `:root` CSS variables).
3. Preserve component hierarchy — only the resolved values change.
4. Verify color contrast (WCAG 2.1 AA: 4.5:1 text, 3:1 UI elements).

### Direction B: Map TO External Stack (e.g., shadcn/ui or Radix)
1. Use unstyled or headless component primitives for behavior and accessibility.
2. Inject your project's CSS variables into the library's theme provider or config.
3. Verify that all 8 interactive states are styled and functional.

### Direction C: Incremental System Migration
1. **Audit**: Catalog existing UI components and active tokens.
2. **Crosswalk**: Build a 1:1 mapping table using [`crosswalk.md`](file:///f:/AI-Project/.agents/skills/design-systems/crosswalk.md).
3. **Bridge Layer**: Alias legacy token names to new tokens so changes can ship incrementally.
4. **Verify**: Test screen-by-screen before removing deprecated aliases.

---

## Mandatory 8-State Coverage Rule

Whenever a component or token role is defined, you MUST guarantee visual and interactive definitions for all 8 standard states:
1. **Default (Rest)**: Base appearance.
2. **Hover**: Pointer focus indication.
3. **Active (Pressed)**: Down state with perceptible tactile feedback.
4. **Focus-Visible**: High-contrast outline for keyboard navigation.
5. **Disabled**: Reduced opacity and `pointer-events: none` (cursor `not-allowed`).
6. **Loading / Busy**: Indication of ongoing action with disabled triggers.
7. **Selected / Checked**: Active toggle or tab state.
8. **Error / Invalid**: Clear validation status with accessible color contrast.

---

## Common Mistakes & Solutions

| Mistake | Prevention |
| :--- | :--- |
| **Mapping by token name instead of role** | Compare component intent and contrast context, not textual similarity. |
| **Skipping focus-visible states** | Always define high-contrast focus rings for keyboard users. |
| **Hardcoding raw hex colors** | Bind all UI styling to semantic tokens in [Rule 05: Design System Telemetry](file:///f:/AI-Project/.agents/rules/05-design-system-telemetry.md). |
| **Overriding accessible contrast for aesthetic taste** | Always test paired foreground/background against WCAG 4.5:1. |
