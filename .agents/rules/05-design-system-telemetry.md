# Rule 05: Precision Engineering Telemetry & Design System

> **Domain Scope**: UI Components, Styling, Telemetry Displays, Design Tokens  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Rule 09: Personas & Portals](file:///f:/AI-Project/.agents/rules/09-personas-and-portals.md)

---

## 1. Visual Philosophy: The Air-Traffic Control Tower

Lambda is an industrial aerospace and precision engineering platform, **not a consumer e-commerce website**. 

> [!IMPORTANT]
> **Design Mandate**:
> 1. **High Information Density**: Engineers, procurement leads, and plant managers need dense, scannable tabular telemetry, unambiguous status codes, and minimal padding.
> 2. **Precision Engineering Telemetry Aesthetic**: Dark, high-contrast, technical canvas reminiscent of a NASA or SpaceX mission control terminal or airport air-traffic control console.
> 3. **Zero Decorative Fluff**: Avoid playful cartoon illustrations, pastel gradients, oversized bubbly cards, or decorative placeholders. Every visual element must convey engineering meaning.
> 4. **Monospace for Engineering Rigor**: Part numbers (`LN-TIT-9021`), alloy designations (`Ti-6Al-4V Grade 5`), tolerances (`±0.008 mm`), surface roughness (`Ra 0.4 µm`), and machine models must be rendered in monospace typography.

---

## 2. Core Token Architecture

All CSS stylesheets and frontend components must strictly consume the design tokens defined below (or in `src/styles/tokens.css`):

```css
:root {
  /* Surface & Canvas Hierarchy */
  --bg-app: #F4F6FA;                    /* Modern airy light canvas */
  --bg-sidebar: #0F172A;                /* Floating deep slate navigation rail */
  --bg-sidebar-hover: #1E293B;          /* Sidebar item hover */
  --bg-surface-primary: #FFFFFF;        /* Primary white container card */
  --bg-surface-secondary: #F8FAFC;      /* Nested panels, data blocks, inputs */
  --bg-surface-elevated: #FFFFFF;       /* Modals, popovers, floating dropdowns */
  --bg-surface-glass: rgba(255, 255, 255, 0.85); /* Frosted glass containers */

  /* Soft Tinted Pastel KPI Gradients */
  --grad-kpi-peach: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  --grad-kpi-mint:  linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
  --grad-kpi-cyan:  linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  --grad-kpi-purple:linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
  --card-hero-dark: #0F172A;            /* High-contrast dark KPI card */

  /* Borders & Dividers */
  --border-subtle: #F1F5F9;             /* Row & section dividers */
  --border-default: #E2E8F0;            /* Primary container borders */
  --border-glass: rgba(255, 255, 255, 0.7); /* Frosted glass highlight border */
  --border-focus: #2563EB;              /* Focus rings and active inputs */

  /* Precision Accents */
  --accent-cyan: #06B6D4;               /* Telemetry data, CAD coordinates */
  --accent-blue: #2563EB;               /* Primary actions, active links */
  --accent-blue-hover: #1D4ED8;

  /* Industrial Status Indicators */
  --status-success: #10B981;            /* Verified, within tolerance, passed */
  --status-success-bg: #ECFDF5;
  --status-warning: #F59E0B;            /* Needs human review, nearing SLA */
  --status-warning-bg: #FFFBEB;
  --status-danger: #EF4444;             /* Quality Gate BLOCKED, Out-of-spec, NCR */
  --status-danger-bg: #FEF2F2;
  --status-info: #3B82F6;               /* Active in-progress telemetry */
  --status-info-bg: #EFF6FF;
  --status-ai: #8B5CF6;                 /* Assistive AI extracted tag */
  --status-ai-bg: #F5F3FF;

  /* Typography Colors */
  --text-primary: #0F172A;              /* High-contrast headlines & primary data */
  --text-secondary: #64748B;            /* Labels, metadata, table headers */
  --text-muted: #94A3B8;                /* Inactive items, placeholder hints */
  --text-code: #0284C7;                 /* Part numbers, DIN/ISO standards, alloy codes */
  --text-hero: #FFFFFF;                 /* Hero dark card primary text */

  /* Radii (Smooth, Not Sharp) */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 26px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02);
  --shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 4px 10px -2px rgba(15, 23, 42, 0.02);
  --shadow-float: 0 20px 35px -8px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03);

  /* Font Families (Clean Executive Sans-Serif) */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## 3. Typography Hierarchy

| Element | Size | Weight | Font | Usage |
| :--- | :---: | :---: | :--- | :--- |
| **Display Header** | 24px | 700 | `var(--font-sans)` | Portal titles, Control Tower main headers |
| **Section Header** | 18px | 600 | `var(--font-sans)` | Drawer titles, card groupings, table sections |
| **Metric Figure** | 24px | 700 | `var(--font-sans)` | KPI figures, unit piece prices, match percentages |
| **Body Primary** | 13px | 400 | `var(--font-sans)` | Standard copy, explanations, notes |
| **Data Label / Meta**| 12px | 500 | `var(--font-sans)` | Column headers, timestamps, badges |
| **Part Code / Spec** | 13px | 600 | `var(--font-sans)` | Part numbers (`AX-204`), tolerances (`±0.012mm`), alloys |

---

## 4. Required Specialized UI Components

### 1. The 17-State Precision Progress Stepper
- Horizontal scrollable or multi-stage stepper reflecting the 17 production states.
- Color states:
  - **Completed**: `#10B981` (Solid Emerald) with check icon.
  - **In-Progress**: `#06B6D4` (Cyan) with subtle pulse animation and active telemetry tooltip.
  - **Gated / Blocked**: `#EF4444` (Crimson) with lock icon.
  - **Future**: `#2D3748` (Slate Outline) with muted number label.

### 2. Hard Quality Gate Banner
- Displayed when state is `QUALITY_DOSSIER_COMPLETE` or order is held at dispatch.
- Prominently displays verified vs. missing artifacts with clear red/green badges and supervisor override CTA.

### 3. Assistive AI Extraction Badges
- Displayed alongside every parameter automatically scraped or extracted from CAD/drawings.
- Includes confidence score, sparkle glyph (`✨`), and direct "Verify" / "Edit" triggers.

---

## 5. Implementation Rules for Agents
- **Frontend Agent**: Never hardcode hex color strings or arbitrary font sizes. Always use CSS custom property variables (`var(--...)`).
- **Design QA Agent**: Inspect typography contrast ratios (WCAG AAA for critical telemetry). Check responsive behavior at 1440px, 1280px, and 1024px desktop widths.
- **No Ad-Hoc CSS Frameworks**: Maintain clean, modular Vanilla CSS aligned with project design tokens.
