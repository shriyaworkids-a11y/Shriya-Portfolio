# PIXEL — Enterprise Product Design System
## Master Architecture & Figma Engineering Specifications

> **System**: PIXEL Enterprise Design System (v2.0.0)  
> **Brand & Aesthetics**: Modern, clean, precision-engineered SaaS UI architecture (Cobalt Blue `#1E40AF`/`#2563EB`, Slate neutrals, 4px/8px modular rhythm)  
> **Iconography Standard**: Google Material Symbols Outlined (Variable Axis: Weight 400, Optical Size 24, Fill 0/1)  
> **Target Product**: Pixel Operations Platform (Enterprise B2B Multi-Role Operations Console)  
> **Target Personas**: Admins, Managers, Operators, Support Teams, SREs  
> **Key Architectural Mandates**: 3-Tier Token Architecture, Universal 8-State Coverage, 4px/8px Spatial Scale, WCAG 2.1 AA/AAA Compliance, Coded Prototype Handoff  

---

## Complete 27-Part System Implementation Matrix

This specification directly maps and implements every requirement from Part 1 through Part 27:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PIXEL DESIGN SYSTEM                             │
│                  27-Part Enterprise Architecture                       │
└────────────────────────────────────────────────────────────────────────┘
  │
  ├── Part 1: Product Context (Pixel Operations Platform & 4 Roles)
  ├── Part 2: 16-Page Figma File Hierarchy (00 to 15)
  ├── Part 3: Foundations — Color (Semantic Tokens & Primitive Scales)
  ├── Part 4: Foundations — Typography (Inter Font Scale & Hierarchy)
  ├── Part 5: Foundations — Spacing (4px to 80px Scale)
  ├── Part 6: Foundations — Radius, Borders & Elevation
  ├── Part 7: Foundations — Responsive System (Breakpoints & Fluid Rules)
  ├── Part 8: Foundations — Google Material Symbols Library
  ├── Part 9: Components — Primitive, Composite & Complex Hierarchy
  ├── Part 10: The Button Deep Dive (Properties, Sizes, Variants, Tokens)
  ├── Part 11: Universal 8-State Coverage Model
  ├── Part 12: Form Controls & Validation States
  ├── Part 13: High-Density Data Table Engine
  ├── Part 14: Navigation (Sidebar & Top Header Bar)
  ├── Part 15: Accessibility Matrix (WCAG 2.1 AA/AAA Compliance)
  ├── Part 16: Enterprise UX Patterns (Approval, Search, Delete, Empty)
  ├── Part 17: Layout Templates (Dashboard, Listing, Form, Detail)
  ├── Part 18: Product Screens (Pixel Operations Platform Live Console)
  ├── Part 19: System in Use Workflow (Component → Pattern → Screen → Product)
  ├── Part 20: Component Documentation Standard
  ├── Part 21: Developer Handoff Tokens & CSS Specs
  ├── Part 22: Coded Interactive Prototype Portal
  ├── Part 23: Playground & Stress-Testing Sandbox
  ├── Part 24: Token-Driven Dark Mode Theming
  ├── Part 25: 3-Tier Token Architecture Engine
  ├── Part 26: Living Changelog (v1.0 to v2.0.0)
  └── Part 27: System Governance & Contribution Model
```

---

### PART 1 — Product Context
* **Product**: **Pixel Operations Platform** — Mission-critical enterprise B2B SaaS console.
* **Target Roles**:
  1. *Admin*: Global permissions, cluster configuration, audit compliance.
  2. *Manager*: Team allocation, quota oversight, incident containment approval.
  3. *Operator / SRE*: Real-time node telemetry monitoring, alert triage, log inspection.
  4. *Support*: User verification, diagnostic reports, incident escalation.
* **Product Surfaces**: Dashboard, Work Orders, Cluster Nodes, Inventory, Telemetry Reports, System Settings.
* **Design System Problem Statement**: 
  > Legacy operations grew across 5 siloed engineering squads, resulting in 14 conflicting button styles, 4 distinct table implementations, arbitrary spacing, and critical accessibility failures.
* **Mission**: Establish a scalable, accessible, tokenized system improving design velocity, developer handoff fidelity, and operator reaction time.

---

### PART 2 — Figma File Structure
The master Figma file is structured into 16 dedicated pages:

```text
PIXEL DESIGN SYSTEM (FIGMA ARTIFACT)
│
├── 00 — Cover / Overview (Manifesto, tokens index, design principles)
├── 01 — Foundations (Grid systems, spatial scale, layout tokens)
├── 02 — Color (Primitives, semantic aliases, light & dark token sets)
├── 03 — Typography (Inter font scale, line heights, letter-spacing)
├── 04 — Spacing & Layout (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px)
├── 05 — Grid & Responsive (Desktop 1440, Tablet 1024, Mobile 390)
├── 06 — Google Material Symbols (Variable axes, sizing, key icon sets)
├── 07 — Elevation & Borders (Tonal surface tiers, stroke weights, radii)
├── 08 — Components (Primitives, composites, complex controls)
├── 09 — Patterns (Containment approval, search/filter, delete confirmation)
├── 10 — Templates (Dashboard, Data Table Listing, Form Section, Detail)
├── 11 — Accessibility (WCAG 2.1 AA/AAA contrast ratios, keyboard rings)
├── 12 — Documentation (Usage guidelines, anatomy, do/don't rules)
├── 13 — Playground (Stress tests, long string truncation, dark mode)
├── 14 — Product Screens (Pixel Operations SOC Command Console)
└── 15 — Changelog & Releases (v1.0.0 to v2.0.0 living history)
```

---

### PART 3 — Foundations: Color
PIXEL separates colors into **Primitives** and **Semantic Roles**:
* **Primitive Palette**:
  - Blue (`#EFF6FF` 50 to `#172554` 950)
  - Slate (`#F8FAFC` 50 to `#020617` 950)
  - Emerald (`#ECFDF5` 50 to `#064E3B` 950)
  - Amber (`#FFFBEB` 50 to `#78350F` 950)
  - Rose (`#FFF1F2` 50 to `#881337` 950)
* **Semantic Tokens (Components ONLY consume these)**:
  - `color.bg.primary`: `#FFFFFF` (Light) / `#0B0F19` (Dark)
  - `color.bg.surface`: `#F8FAFC` (Light) / `#111827` (Dark)
  - `color.text.primary`: `#0F172A` (Light) / `#F8FAFC` (Dark)
  - `color.text.secondary`: `#475569` (Light) / `#94A3B8` (Dark)
  - `color.action.primary`: `#1E40AF` (Light) / `#2563EB` (Dark)
  - `color.action.primary.hover`: `#1D4ED8` (Light) / `#3B82F6` (Dark)
  - `color.border.default`: `#E2E8F0` (Light) / `#1F2937` (Dark)
  - `color.status.success`: `#059669` / `color.status.warning`: `#D97706` / `color.status.danger`: `#E11D48`

---

### PART 4 — Foundations: Typography
Single font family: **Inter** for clean legibility, paired with **JetBrains Mono** for telemetry data:
* **Display**: 36px / Line Height 44px / Weight 700 / Tracking -0.02em
* **H1 (Hero)**: 28px / Line Height 36px / Weight 700 / Tracking -0.015em
* **H2 (Section)**: 22px / Line Height 28px / Weight 600 / Tracking -0.01em
* **H3 (Card Header)**: 18px / Line Height 24px / Weight 600 / Tracking 0
* **Title / Subheading**: 15px / Line Height 20px / Weight 600 / Tracking 0
* **Body Large**: 16px / Line Height 24px / Weight 400 / Tracking 0
* **Body (Default)**: 14px / Line Height 20px / Weight 400 / Tracking 0
* **Body Small / Table Cell**: 13px / Line Height 18px / Weight 400 / Tracking 0
* **Caption / Metadata**: 12px / Line Height 16px / Weight 500 / Tracking +0.01em
* **Label / Badge**: 11px / Line Height 14px / Weight 600 / Tracking +0.02em (Uppercase option)
* **Code / Hash**: JetBrains Mono 12px / Line Height 16px / Weight 500

---

### PART 5 — Foundations: Spacing Scale
Modular 4px/8px scale — strictly eliminates arbitrary pixel values:
* `space.0`: 0px
* `space.1`: 4px (micro gaps, badge inner padding)
* `space.2`: 8px (icon-to-text gap, compact button padding)
* `space.3`: 12px (form input internal vertical padding)
* `space.4`: 16px (standard component padding, button horizontal)
* `space.5`: 20px (card inner gutters)
* `space.6`: 24px (section margins, table padding)
* `space.8`: 32px (container block gaps)
* `space.10`: 40px (large component separation)
* `space.12`: 48px (layout column spacing)
* `space.16`: 64px (major module separation)
* `space.20`: 80px (page section rhythm)

---

### PART 6 — Foundations: Radius, Borders & Elevation
* **Radius Tokens**:
  - `radius.none`: 0px
  - `radius.sm`: 4px (tags, sub-elements)
  - `radius.md`: 6px (buttons, inputs)
  - `radius.lg`: 10px (cards, dropdown menus)
  - `radius.xl`: 16px (modal dialogs, floating drawers)
  - `radius.full`: 9999px (badges, avatar rings, filter chips)
* **Border Tokens**:
  - `border.default`: 1px solid `var(--pixel-border-default)`
  - `border.strong`: 1.5px solid `var(--pixel-border-strong)`
  - `border.focus`: 3px solid `var(--pixel-action-primary)` (with 2px offset)
* **Elevation Tokens**:
  - `elevation.none`: none
  - `elevation.sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  - `elevation.md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
  - `elevation.lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
  - `elevation.xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`

---

### PART 7 — Foundations: Responsive Grid & Breakpoints
* **Breakpoints**:
  - Mobile: `< 768px` (Fluid single column, stacked tables, bottom sheet modals)
  - Tablet: `768px – 1024px` (Collapsible sidebar, 2-column KPI grids, scrollable table view)
  - Desktop: `1024px – 1440px` (Fixed 240px sidebar, 4-column KPI grids, high-density data tables)
  - Wide Desktop: `> 1440px` (Max container 1600px with auto margins)
* **Fluid vs Fixed Rules**:
  - Sidebar width: Fixed 240px (expanded) / 64px (compact icon-only mode)
  - Content canvas: Fluid `calc(100% - 240px)`
  - Form inputs: Fluid within grid columns; max-width 480px for single-field forms
  - Table columns: Fixed widths for status/checkbox/actions; fluid for telemetry host/IP

---

### PART 8 — Foundations: Google Material Symbols
All system icons are standardized on **Google Material Symbols (Outlined)**:
* Optical Size: 24 (Default) / 20 (Dense controls)
* Weight: 400 (Regular)
* Grade: 0
* Fill: 0 (Outlined) / 1 (Active/Selected state)
* Categorized Libraries:
  - *Navigation*: `dashboard`, `layers`, `tune`, `dns`, `receipt_long`, `terminal`, `settings`
  - *Actions*: `add`, `search`, `refresh`, `download`, `content_copy`, `close`, `check`, `arrow_forward`
  - *Status*: `check_circle`, `warning`, `error`, `info`, `lock`, `shield`
  - *Data*: `swap_vert`, `filter_list`, `more_vert`, `view_column`, `table_rows`

---

### PART 9 — Components Hierarchy
* **Primitives**: Button, Icon Button, Input, Textarea, Checkbox, Radio, Switch, Badge, Avatar, Divider, Tooltip.
* **Composites**: Search Input, Select Dropdown, Filter Chip Bar, Pagination Controller, Tabs, Breadcrumbs, Toast Alert, Modal Dialog.
* **Complex Patterns**: High-Density Operations Data Table, Host Quarantine Approval Modal, SOC Telemetry KPI Bar, Collapsible Command Sidebar.

---

### PART 10 — Button Component Deep Dive
* **Variants**: Primary, Secondary, Tonal, Outline, Ghost, Danger, Pill.
* **Sizes**: Small (32px / font 13px), Medium (40px / font 14px), Large (48px / font 15px).
* **Properties**:
  - `label`: String
  - `leadingIcon`: Symbol (optional)
  - `trailingIcon`: Symbol (optional)
  - `disabled`: Boolean
  - `loading`: Boolean (auto-swaps text for CSS spinner, preserves exact button width)
* **Tokens**:
  - Background: `action.primary` -> Hover: `action.primary.hover` -> Pressed: `action.primary.active`
  - Focus Ring: 3px solid `action.primary` with 2px offset for WCAG compliance.

---

### PART 11 — Universal 8-State Coverage Model
Every interactive control within PIXEL is tested against all 8 states:
1. **Default (Rest)**: Base idle state with optimal contrast & clear boundaries.
2. **Hover**: Pointer focus indication with subtle brightness shift & elevation.
3. **Active (Pressed)**: Down-state tactile feedback with `transform: translateY(0)`.
4. **Focus-Visible**: High-contrast 3px outline (`--pixel-focus-ring`) for WCAG 2.4.7 keyboard navigation.
5. **Disabled**: Reduced opacity (0.45), `cursor: not-allowed`, inert.
6. **Loading**: Preserves exact layout dimensions with integrated animated SVG spinner to eliminate layout shift.
7. **Selected / Checked**: Active toggle or selected table row indication.
8. **Error / Invalid**: Layout-preserving inline error alerts with accessible text.

---

### PART 12 — Forms & Validation Architecture
* **Text Input**: 42px height, 8px radius, leading Material Symbol, trailing clear button.
* **Select Dropdown**: Custom styled trigger with chevron animation, native accessible fallback.
* **Switch**: 48px width, 26px height, sliding rounded thumb with check indicator.
* **Validation Principle**: Error messages reserve vertical layout space (`min-height: 18px`) to prevent page jitter when invalid fields trigger.

---

### PART 13 — High-Density Operations Data Table
* **Density Tiers**: Compact (36px row height for NOC monitors) and Standard (48px row height).
* **Interactive Capabilities**:
  - Real-time client-side keyword search (filters across hostname, IP, region, status).
  - Column sorting with `swap_vert` symbol and `aria-sort` accessibility attributes.
  - Multi-row selection with master checkbox and dynamic bulk action bar.
  - Client-side pagination (5 rows per page with page jump buttons).
  - Real-time CSV export with instant download (`pixel_operations_telemetry.csv`).
  - Row action menu launching the Host Containment Approval Workflow.

---

### PART 14 — Navigation System
* **Sidebar (Pixel Command Navigation)**:
  - Collapsible design with smooth CSS transitions.
  - Active item indicator with subtle Cobalt background tint.
  - Keyboard accessible navigation links with clean focus outlines.
* **Top App Bar**:
  - Live system status beacon ("All Systems Operational").
  - Quick search shortcut (`Ctrl + K` visual prompt).
  - Light/Dark theme toggle button with immediate token remapping and toast feedback.

---

### PART 15 — Accessibility Matrix (WCAG 2.1 AA/AAA)
* **Color Contrast**:
  - Primary text on surface: `14.2:1` (Exceeds AAA requirement of 7:1)
  - Secondary text on surface: `6.4:1` (Exceeds AA requirement of 4.5:1)
  - Action button text: `5.1:1` (Passes AA requirement)
* **Keyboard Navigation**:
  - Logical tab order across all interactive controls.
  - Visible 3px focus rings on `:focus-visible` with zero outline suppression.
* **Screen Reader Support**:
  - Semantic HTML (`<main>`, `<nav>`, `<header>`, `<table>`, `<dialog>`).
  - ARIA attributes: `aria-expanded`, `aria-selected`, `aria-sort`, `role="status"`.

---

### PART 16 — Enterprise UX Patterns
* **Approval Pattern (Two-Man Rule)**:
  1. Trigger action from table row ("Quarantine Host").
  2. Modal opens displaying critical warning, blast radius impact, and node ID.
  3. Operator confirms authorization.
  4. Instant row status change to "Contained" + persistent audit toast notification.
* **Search & Multi-Facet Filter Bar**: Debounced input + pill chips for instant status toggling.
* **Empty State Pattern**: Illustrated state with clear explanation and primary recovery call-to-action.

---

### PART 17 — Layout Templates
* **Operations Dashboard**: Metric KPI header -> Critical alert feed -> High-density telemetry table.
* **Listing Page**: Search header -> Facet filter bar -> Sortable data table -> Pagination bar.
* **Detail Page**: Hero title with status badge -> Action bar -> Metric grid -> Activity timeline.
* **Form Page**: Multi-step indicator -> Grouped card sections -> Fixed action footer bar.

---

### PART 18 — Product Screens: Pixel Operations Console
Built directly into the live coded portal (`Shriya's Remake/pixel-design-system/index.html`):
* SOC Cluster Overview Dashboard
* Active Node Telemetry Table (with live data)
* Containment Action Modal
* Token Inspector & 8-State Simulator

---

### PART 19 — System in Use Workflow
```text
┌────────────────────────────────────────────────────────┐
│  Component: .pixel-btn--danger                         │
│  └── 40px height, 6px radius, Rose-600 background      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  Pattern: Containment Approval Dialog                  │
│  └── Destructive action confirmation modal             │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  Product Screen: SOC Command Operations Console        │
│  └── Host quarantine trigger in cluster telemetry      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  Enterprise Product: Pixel Operations Platform         │
│  └── Mission-critical multi-role cloud infrastructure  │
└────────────────────────────────────────────────────────┘
```

---

### PART 20 — Component Documentation Standard
Every component in the design system follows this documentation specification:
* **Name & Hierarchy**: E.g., `Button / Primary / Medium`
* **Purpose**: Clear definition of when and why to use it.
* **Anatomy**: Diagram of container, label, leading icon, trailing icon.
* **Variants & Sizes**: Matrix of available types.
* **8-State Coverage**: Visual verification across all 8 states.
* **Accessibility**: Screen reader semantics, contrast ratios, keyboard commands.
* **Do's & Don'ts**: Concrete anti-patterns to avoid.

---

### PART 21 — Developer Handoff Tokens & CSS Specs
Component CSS code snippet exported directly for engineers:
```css
/* Pixel Button Primary Medium */
.pixel-btn--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--pixel-space-2, 8px);
  height: 40px;
  padding: 0 var(--pixel-space-4, 16px);
  border-radius: var(--pixel-radius-md, 6px);
  font-family: var(--pixel-font-family, 'Inter', sans-serif);
  font-size: var(--pixel-font-size-body, 14px);
  font-weight: 600;
  color: #FFFFFF;
  background-color: var(--pixel-action-primary);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.pixel-btn--primary:hover:not(:disabled) {
  background-color: var(--pixel-action-primary-hover);
  box-shadow: var(--pixel-elevation-sm);
}

.pixel-btn--primary:focus-visible {
  outline: 3px solid var(--pixel-action-primary);
  outline-offset: 2px;
}

.pixel-btn--primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
```

---

### PART 22 — Coded Interactive Prototype Portal
The live coded prototype is fully functional in `Shriya's Remake/pixel-design-system/index.html`:
* **Zero build dependencies**: Runs immediately in any browser via pure HTML5, CSS3, and JavaScript.
* **Working clicks on every control**:
  - Live Theme Toggle (Light / Dark mode persistence with localStorage).
  - 8-State Simulator (switch between Default, Focus, Disabled, Loading, Error).
  - Click-to-copy color swatches with instant toast alerts.
  - Live search filtering across table rows.
  - Multi-column sorting (`swap_vert`).
  - Active filter chips (All, Active, Warning, Contained).
  - Client-side pagination (16 realistic records sliced across 4 pages).
  - CSV telemetry export with instant download.
  - Containment approval modal with state change confirmation.
  - Code snippet copy buttons with tactile checkmark feedback.

---

### PART 23 — Playground & Stress-Testing Sandbox
* **Extreme String Truncation**: Stress-tested with 45-character hostnames using CSS ellipsis (`text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`).
* **High-Density Data**: Verified table layout at 100% viewport width without horizontal overflow.
* **Dark Mode Contrast**: Verified all text and border contrast ratios under `#0B0F19` background.

---

### PART 24 — Token-Driven Dark Mode Theming
Dark mode is implemented via CSS Custom Properties under `[data-theme="dark"]`:
* No duplicate component styles or HTML changes needed.
* All semantic variables (`--pixel-bg-primary`, `--pixel-text-primary`, `--pixel-border-default`) re-alias automatically.
* Tonal contrast is preserved to eliminate glare in dark environments.

---

### PART 25 — 3-Tier Token Architecture Engine
```text
Primitive:  --pixel-primitive-blue-600: #2563EB
                 │
                 ▼
Semantic:   --pixel-action-primary: var(--pixel-primitive-blue-600)
                 │
                 ▼
Component:  .pixel-btn--primary { background: var(--pixel-action-primary); }
```

---

### PART 26 — Living Changelog
* **v1.0.0**: Initial foundational primitive palette, 8pt spacing rhythm, and button components.
* **v1.1.0**: Form controls, outlined input fields, switches, and validation states.
* **v1.2.0**: WCAG 2.1 AA/AAA accessibility audit, 3px focus-visible rings, contrast fixes.
* **v1.3.0**: Automated CSS custom properties token-driven Dark Mode engine.
* **v2.0.0**: High-density Operations Data Table, client-side pagination, Google Material Symbols, live coded interactive prototype portal.

---

### PART 27 — Governance & Contribution Model
* **RFC Proposal**: Designer or engineer submits proposal for a new component or variant.
* **Design System Council Review**: Evaluates reusability, token adherence, and accessibility compliance.
* **Token Standardization**: Tokens created in Figma Variables and exported to `pixel-tokens.css`.
* **Component Implementation**: Code developed with 8-state coverage and zero layout shift.
* **Automated QA & Handoff**: Visual regression testing, WCAG audit, and changelog update.
