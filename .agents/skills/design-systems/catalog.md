# Design Systems Catalog & Archetypes

This catalog provides an index of established design system archetypes and signatures from modern software leaders. Use these profiles when benchmarking visual aesthetics, selecting design tokens, or deriving component styling for application interfaces.

---

## 1. Design Archetypes

### Modern Dark / Technical (Linear, Raycast, Vercel, Supabase)
- **Palette**: Deep dark neutrals (`#08090a`, `#121316`, `#1c1d22`), crisp borders (`#27282d`), neon/electric accents (indigo, purple, emerald, cyan).
- **Typography**: Clean grotesque sans-serif (Inter, Geist, SF Pro), monospace numerals for tables and metrics.
- **Surface Elevation**: Micro-borders with subtle inset shadows and specular highlights, rather than heavy drop shadows. Glassmorphic overlays with `backdrop-filter: blur()`.
- **Radius**: Medium-tight (6px–8px).
- **Vibe**: High precision, developer-first, performant, sleek.

### Clean Enterprise / Data Density (Carbon, Ant, Retool, Metabase)
- **Palette**: Neutral cool grays (`#f4f5f7` light, `#161616` dark), strong contrast borders (`#e0e0e0`, `#393939`), corporate primary blue.
- **Typography**: Compact sans-serif with high x-height, tabular numerals, 12px–14px body scales.
- **Spacing**: Strict 4px/8px grid with high-density compact variants for tables, filters, and forms.
- **Radius**: Minimal (2px–4px) to maximize screen real estate.
- **Vibe**: Analytical, authoritative, industrial, reliable.

### Premium Editorial / Consumer (Airbnb, Stripe, Apple, Notion)
- **Palette**: Warm neutrals (stone, cream, off-white), intentional high-contrast type, subtle brand accents.
- **Typography**: Humanist sans-serif or refined serif accents, generous line-heights (1.5–1.6), bold section headers.
- **Spacing**: Generous whitespace (16px, 24px, 32px, 48px), breathing room between content sections.
- **Radius**: Soft, continuous rounded corners (12px–20px).
- **Vibe**: Approachable, crafted, human, sophisticated.

---

## 2. Benchmark Design Systems Index

| System | Primary Stack | Key Aesthetic Attributes | Best For |
| :--- | :--- | :--- | :--- |
| **shadcn / Radix** | Tailwind CSS, React | Utility-driven, headless accessibility, customizable tokens | Modern web apps, fast MVPs |
| **Material Design 3** | Web, Android, Flutter | Dynamic tonal palettes, elevation via surface tint, fluid motion | Cross-platform, Google ecosystem |
| **Apple HIG** | SwiftUI, UIKit, Web | Vibrancy/materials, system colors, SF Pro typography, smooth squircle curves | iOS/macOS alignment, premium feel |
| **Carbon (IBM)** | React, Vanilla, Angular | Strict 2x grid, tokens by intent (`$layer`), accessible high contrast | Complex enterprise dashboards, B2B |
| **Primer (GitHub)** | React, CSS vars | Developer focus, functional variables (`--fgColor-*`), dark mode first | Code tools, collaboration suites |
| **Polaris (Shopify)** | React, CSS vars | High density, commerce operations, merchant workflows | E-commerce backoffice, order desks |
| **Atlassian (ADS)** | React, Token packages | Intent tokens (`color.background.brand.bold`), comprehensive states | Workflow trackers, project boards |
| **Fluent 2 (Microsoft)** | Web, Windows, React | Mica/Acrylic materials, subtle depth elevations, accessibility | Enterprise productivity, Windows UI |

---

## 3. How to Select a Target System
1. **Identify the Domain & User Role**:
   - Industrial / Operations / Logistics → **High-density / Clean Enterprise** (Carbon / Polaris style)
   - Developer tools / Analytics → **Modern Dark / Technical** (Linear / Vercel style)
   - Consumer / Marketing portal → **Premium Editorial** (Apple / Stripe style)
2. **Consult [Crosswalk](file:///f:/AI-Project/.agents/skills/design-systems/crosswalk.md)** to pull appropriate token names.
3. **Apply [Interop Protocol](file:///f:/AI-Project/.agents/skills/design-systems/interop-protocol.md)** to verify contrast ratios and state completeness.
