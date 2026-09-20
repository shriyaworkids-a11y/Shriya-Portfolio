# Rule 08: Technical Architecture, Topology & Decision Records

> **Domain Scope**: System Topology, Data Flow, Boundary Isolation, Architecture Decision Records (ADRs)  
> **Source Origin**: Core System Architecture & Platform Design Decisions

---

## 1. System Topology & Three-Portal Data Flow

Lambda functions as a dual-sided orchestration engine with a centralized, authoritative operational control center:

```
┌────────────────────────────────────────────────────────┐
│                   BUYER PORTAL (OEM)                   │
│   RFQ Studio  │  Spec Sign-off  │  Order Tracking     │
└──────────────────────────┬─────────────────────────────┘
                           │ (CAD / RFQ Submission)
                           ▼
┌────────────────────────────────────────────────────────┐
│             LAMBDA OPERATIONS CONTROL TOWER             │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │ DFM / Spec Triage│  │ Assistive AI Match Engine   │ │
│  └────────┬─────────┘  └──────────────┬──────────────┘ │
│           │                           │                │
│  ┌────────▼─────────┐  ┌──────────────▼──────────────┐ │
│  │ Proposal Builder │  │ Hard Quality Gate Enforcer  │ │
│  └──────────────────┘  └─────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────┘
                           │ (Targeted RFQ / Order Award)
                           ▼
┌────────────────────────────────────────────────────────┐
│               SUPPLIER PORTAL (MANUFACTURER)           │
│   Machine Matrix │  Quoting  │  Quality Dossier Upload │
└────────────────────────────────────────────────────────┘
```

---

## 2. Platform Architecture Decision Records (ADRs)

### ADR 001: Separation of Portals with Centralized Ops Control Tower
- **Status**: Accepted
- **Context**: The platform connects three fundamentally distinct personas: Western OEM enterprise buyers, Indian precision machine shops, and Lambda internal engineering/operations personnel.
- **Decision**: Implement three dedicated portal views sharing a common design system token library and domain model, with Lambda Operations functioning as the master air-traffic control tower. The buyer and supplier never exchange raw contact details or see unmoderated margins.

### ADR 002: Assistive vs. Autonomous AI
- **Status**: Accepted
- **Context**: In aerospace and mission-critical manufacturing, autonomous hallucination or unverified algorithmic actions present unacceptable financial and flight-safety risks.
- **Decision**: All AI capabilities (CAD/Drawing extraction, supplier matchmaking) are strictly assistive. The UI must explicitly present the evidence/confidence behind any AI suggestion and provide zero-friction human verification and override controls.

### ADR 003: Hard Quality Gate Architecture
- **Status**: Accepted
- **Context**: Part shipments must not depart origin without 100% compliance verification (AS9102 FAIR, CMM reports, MTRs).
- **Decision**: The state machine strictly blocks progression to `READY_TO_SHIP` unless all mandatory artifacts are present and approved by QA. Overrides require dual-factor authorization (supervisor PIN + justification code + linked concession documentation).

---

## 3. Technology Stack & Architectural Boundaries
1. **Frontend Architecture**: Vanilla HTML5, CSS3 with CSS Custom Properties, and modular ES6 JavaScript. High information density, scannable tabular telemetry, and zero decorative bloat.
2. **State & Lifecycle Layer**: Authoritative finite state machine ensuring linear progression across 17 manufacturing stages with rollback restricted to formal NCR quarantine branches.
3. **Data Protection & Commercial Shielding**: Role-based access control (RBAC) ensuring supplier corporate identities, margins, and direct communication channels are completely masked from buyers.
