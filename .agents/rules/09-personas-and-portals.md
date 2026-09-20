# Rule 09: Personas, Portal Architectures & Functional Requirements

> **Domain Scope**: User Personas, Screen Modules (B01–B40, S01–S38, O01–O58), Functional Requirements  
> **Source Origin**: Master User Journey Specifications & Domain Requirements

---

## 1. Key User Personas

### 1.1 👨‍💼 The Enterprise Buyer: Sarah Mitchell
- **Role**: Procurement Manager, AeroTech Systems Inc. (Tier-1 Aerospace OEM, Chicago, IL).
- **Mindset**: Highly technical, risk-averse, quality-obsessed. Zero tolerance for counterfeit materials, delayed dispatches, or incomplete inspection dossiers.
- **Core Motivation**: Diversify precision CNC supply chains into India while dealing exclusively with Lambda as the accountable tier-1 vendor of record.
- **Primary Modules**: RFQ creation wizard, CAD/2D drawing upload, assistive AI spec review, proposal evaluation, live 17-state order tracking, inward acceptance sign-off.

### 1.2 🏭 The Precision Supplier: Rajesh Patel & Vikram Sharma
- **Roles**: Rajesh Patel (Managing Director & Quoting Engineer), Vikram Sharma (Plant Operations Manager), Precision Parts Manufacturing Pvt Ltd (Bangalore, India).
- **Mindset**: Expert in 5-axis milling (DMG Mori NMV 5000), Swiss turning, and Inconel/Titanium machining. Needs export-grade CAD packages, clear DFM specs, structured quoting, and prompt payment milestones.
- **Primary Modules**: Facility profile & machine registry, AS9100/ISO certification vault, RFQ dispatch inbox, structured cost-breakdown quoting, production stage telemetry updates, quality dossier submission (MTR, CMM, AS9102 FAIR, CoC).

### 1.3 🧑‍💻 Lambda Operations Control Tower: Arjun Mehta & Marcus Vance
- **Roles**: Arjun Mehta (Operations Coordinator & TME), Marcus Vance (Quality Assurance Director).
- **Mindset**: "The Guardians of the Process." Total global pipeline visibility, DFM triage, assistive AI supplier matching, quote normalization, gross margin building, and hard quality gate enforcement.
- **Primary Modules**: Air-traffic dashboard, RFQ technical triage desk, AI matching engine & explainability cards, multi-supplier quote normalization matrix, margin builder, hard quality gate enforcer, NCR & CAPA center.

---

## 2. Portal Screen Architectures & Functional Specifications

### 2.1 Buyer Portal (BP-REQ / B01–B40) — 18-Point Complete Decision Architecture
- **BP-REQ-01 (Auth & Account Recovery)**: Enterprise login with Forgot Password recovery loop (email entry, reset token dispatch, password reset), invalid credential lockouts, and email verification lifecycle (resend, expired token handling, verification success).
- **BP-REQ-02 (Org & Role-Based Permissions)**: Multi-tenant role definitions:
  - *Procurement*: RFQ creation, commercial proposal approvals, PO releases, repeat order cloning.
  - *Engineering*: CAD/drawing upload, GD&T tolerance spec review, technical clarification replies.
  - *Quality*: Inspection report evaluation, CMM point-cloud reviews, dock QA sign-off, inward NCR filing.
  - *Admin*: User provisioning, organization profiles, compliance certification uploads, audit trail exports.
  - *Viewer*: Read-only telemetry access across dashboards, tracking, and documents.
- **BP-REQ-03 (Draft RFQ & Resume Later)**: Non-blocking RFQ authoring with continuous auto-save, explicit "Save Draft & Exit", draft status indicators on dashboard, and one-click resume.
- **BP-REQ-04 (Pre-Submission Validation Decision Branch)**: Deterministic validation engine checking:
  - Non-zero lot quantities.
  - Certified alloy designation (AMS/ASTM).
  - Drawing revision specification and title-block parity.
  - Required 3D CAD (.STEP/.IGES) and 2D blueprint (.PDF) attachments.
  - Missing field inline blockers with direct jump-to-step navigation.
- **BP-REQ-05 (RFQ Cancellation & Withdrawal)**: Formal cancellation workflow with rule-based eligibility:
  - Allowed: `DRAFT`, `SUBMITTED`, `CLARIFICATION_REQUIRED`.
  - Blocked: `PROPOSAL_READY` (proposals active) or PO issued. Modal captures cancellation rationale for audit.
- **BP-REQ-06 (Lambda Technical Clarification Loop)**: Controlled bidirectional clarification thread:
  - Lambda Ops (Arjun Mehta) flags drawing ambiguities (e.g. surface finish scope, datum references).
  - Buyer provides engineering response with optional revised drawing upload.
  - State transitions to `UNDER_LAMBDA_RE_REVIEW` ➔ `REQUIREMENTS_VALIDATED` before certified supplier sourcing begins.
- **BP-REQ-07 (Proposal 3-Way Decision Architecture)**:
  - *Branch A (Approve)*: Locks volume tier, authorizes tooling NRE, releases bilateral PO.
  - *Branch B (Clarify / Revise)*: Buyer requests counter-proposal (lead time compression, split lots, price target) ➔ Lambda revision loop.
  - *Branch C (Decline)*: Rejection with structured feedback (budget, alternative sourcing, program deferred).
- **BP-REQ-08 (Proposal Version Comparison & Diff Viewer)**: Side-by-side delta visualization between proposal iterations (Rev 1 vs Rev 2): piece-price curves, lead time guarantees, NRE tooling amortization, and DFM concessions.
- **BP-REQ-09 (Awaiting Supplier Confirmation Intermediate State)**: Order status progression reflects bilateral SLA: `ORDER_CREATED` ➔ `AWAITING_SUPPLIER_CONFIRMATION` (cluster capacity locking) ➔ `ORDER_CONFIRMED` ➔ `SHOP_TRAVELER_RELEASED`.
- **BP-REQ-10 (Production Delay & At-Risk Telemetry)**: Real-time spindle telemetry flags `ON_TRACK` vs `AT_RISK` / `DELAYED`. Lambda Active Risk Mitigation alerts provide proactive containment plans and updated guaranteed ETAs.
- **BP-REQ-11 (Pre-Shipment Quality Issue & NCR Loop)**: In-process CMM dimensional discrepancy detection ➔ in-process NCR quarantined at origin ➔ cluster rework action executed ➔ Zeiss CMM re-inspection passes ➔ dossier verified before release.
- **BP-REQ-12 (Hard Quality Gate Dispatch Lock)**: Strict compliance with [Rule 01](file:///f:/AI-Project/.agents/rules/01-hard-quality-gates.md): dispatch remains locked in `QUALITY_GATE_HOLD` until all 6 compliance artifacts (MTR, AS9102 FAIR, CMM, Nadcap Certs, CoC, Packaging Photos) are 100% verified.
- **BP-REQ-13 (International Logistics & Customs Exception)**: Real-time air cargo radar (Flight AI-129) with dual-state customs telemetry (`CUSTOMS_CLEARED` vs `CUSTOMS_HOLD`). US CBP ACE clearance delays trigger automated Lambda broker resolution and updated dock arrival ETAs.
- **BP-REQ-14 (Delivered Buyer Dock QA — Two Explicit Branches)**:
  - *Path A (Accept)*: Inward inspection checklist sign-off ➔ `ORDER_CLOSED`.
  - *Path B (Discrepancy / NCR Raised)*: Inward NCR logged (transit damage, packaging seal breach, sampling dimensional failure) ➔ Lambda QA investigation ➔ warranty rework/replacement lot dispatched under tier-1 guarantee ➔ final buyer acceptance ➔ `ORDER_CLOSED`.
- **BP-REQ-15 (Classified Documents Vault)**: 6 categorized repositories (Engineering, Manufacturing, Quality Dossier, Special Certs, Shipping & Customs, Final Order Dossier) with 5 lifecycle status badges (`AVAILABLE`, `PENDING`, `LOCKED`, `APPROVED`, `EXPIRED`).
- **BP-REQ-16 (Controlled Lambda Operations Messaging)**: Multi-tenant, commercially shielded communication hub between Buyer and Lambda Ops coordinators; supplier corporate identities remain protected under certified cluster designations (`#IN-XXX`).
- **BP-REQ-17 (Event-Driven Notification Stream)**: Real-time event notifications for RFQ milestones, technical clarifications, proposal releases/revisions, quality gate holds, flight departures, and dock delivery.
- **BP-REQ-18 (Repeat Order Cloning & Re-order Engine)**: 1-click repeat order generation from closed purchase orders (`ORD-58104`): pre-populates certified specifications, allows volume scaling, drawing revision bump, and schedules new production batch.

### 2.2 Supplier Portal (SP-REQ / S01–S38)
- **SP-REQ-01 (Facility Profile & Machine Matrix)**: Machine list (spindle limits, envelope X/Y/Z, axes, precision rating) and inspection gear (Zeiss CMM, surface testers).
- **SP-REQ-02 (Certification Vault)**: Document upload and expiration tracking for AS9100 Rev D, ISO 9001:2015, ISO 13485, and Nadcap accreditations.
- **SP-REQ-03 (Targeted RFQ Inbox)**: Queue of RFQs matched by Lambda Ops with complete DFM-validated drawing packages under bilateral NDA.
- **SP-REQ-04 (Cost-Breakdown Quoting Engine)**: Itemized quoting (raw billet weight/cost, cycle time, machine hour rate, custom tooling, Nadcap special processing, and AS9102 FAIR fees).
- **SP-REQ-05 (Production Stage Progression)**: Real-time milestone controls to advance orders through FSM stages with photo evidence.
- **SP-REQ-06 (Quality Dossier Submission)**: Upload center for MTR, in-process check sheets, CMM raw inspection reports, AS9102 Forms 1–3, and CoC.
- **SP-REQ-07 (NCR Resolution)**: Interface to review non-conformance reports, submit 8D root-cause analysis, and execute rework/remake actions.

### 2.3 Lambda Operations Control Tower (OPS-REQ / O01–O58)
- **OPS-REQ-01 (Global Dashboard)**: KPI widgets (Active RFQs in Triage, Quotes Pending Review, Active Production Runs, At-Risk Orders, Quality Gate Holds).
- **OPS-REQ-02 (RFQ Engineering Review & DFM Triage)**: Split-screen drawing/CAD viewer, DFM risk analysis (thin walls, deep pockets, non-standard threads).
- **OPS-REQ-03 (Assistive AI Matchmaking Engine)**: 5-vector composite scoring with Explainability Drawer and mandatory operator override contracts.
- **OPS-REQ-04 (Multi-Quote Comparison Matrix)**: Side-by-side comparative table of bids evaluating unit price, lead time, tooling, defect PPM, and schedule reliability.
- **OPS-REQ-05 (Margin Engine & Proposal Generator)**: Dynamic gross margin slider, freight/duty calculator, and shielded buyer proposal builder (`#IN-XXX`).
- **OPS-REQ-06 (Hard Quality Gate Enforcer)**: System lock preventing status transition to `READY_TO_SHIP` until all 6 compliance artifacts pass (with dual-factor supervisor override protocol).
- **OPS-REQ-07 (NCR & CAPA Center)**: Log non-conformance with part serials, photo evidence, nominal vs. measured deviation, and 8D root cause tracking.
- **OPS-REQ-08 (Immutable Event Audit Log)**: Cryptographic, append-only event stream recording actor, timestamp, action, prior value, new value, and rationale.
