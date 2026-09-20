# Rule 02: The 17-State Precision Manufacturing Finite State Machine (FSM)

> **Domain Scope**: Order Lifecycle, State Transitions, Non-Conformance & Quarantine  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Rule 09: Personas & Portals](file:///f:/AI-Project/.agents/rules/09-personas-and-portals.md)

---

## 1. FSM Architectural Principles

Every manufacturing order in Lambda traverses an authoritative, strictly sequential 17-state finite state machine.

> [!IMPORTANT]
> **State Machine Invariants**:
> 1. **No Out-of-Order Execution**: An order cannot skip intermediate manufacturing stages (e.g. progressing directly from `MATERIAL_SOURCING` to `IN_PROCESS_MACHINING` without passing `MATERIAL_INWARD_QA`).
> 2. **Monotonic Progression**: Normal order progression flows strictly forward. Reverse transitions are prohibited during normal operations.
> 3. **Controlled Discrepancy Routing**: Rollback and rework are only permitted via the formal `NCR_QUARANTINE` non-conformance sub-workflow.
> 4. **Milestone Telemetry**: Every state transition must record a timestamp, initiating actor, machine/facility metadata, and inspection evidence.

---

## 2. The 17 Production States

```mermaid
stateDiagram-v2
    [*] --> PO_RECEIVED : Buyer Signs Proposal & Issues PO
    PO_RECEIVED --> SUPPLIER_ACCEPTED : Supplier Formally Accepts Slot & Spec
    SUPPLIER_ACCEPTED --> TOOLING_FIXTURES : Setup, Jigs & Custom Carbide Tooling Prepped
    TOOLING_FIXTURES --> MATERIAL_SOURCING : Raw Mill Billet Procured (Heat/Lot Tagged)
    MATERIAL_SOURCING --> MATERIAL_INWARD_QA : MTR Verified Against Drawing Spec
    MATERIAL_INWARD_QA --> PRODUCTION_STAGED : Work Order Released to Shop Floor
    PRODUCTION_STAGED --> IN_PROCESS_MACHINING : CNC 5-Axis / Swiss Turning Underway
    IN_PROCESS_MACHINING --> IN_PROCESS_INSPECTION : First-Off & In-Process Dimensional Check
    IN_PROCESS_INSPECTION --> SURFACE_TREATMENT : Anodize / Heat Treat / Passivation / NDT
    SURFACE_TREATMENT --> FINAL_INSPECTION : CMM Dimensional & Visual Inspection
    FINAL_INSPECTION --> QUALITY_DOSSIER_COMPLETE : All 6 Artifacts Uploaded
    
    QUALITY_DOSSIER_COMPLETE --> READY_TO_SHIP : Hard Quality Gate Verified (or Overridden)
    note right of READY_TO_SHIP: Hard Gated: Cannot ship without 6 verified artifacts
    
    READY_TO_SHIP --> DISPATCHED_ORIGIN : Freight Handover & AWB Issued
    DISPATCHED_ORIGIN --> INTERNATIONAL_TRANSIT : Air / Ocean Freight Active
    INTERNATIONAL_TRANSIT --> CUSTOMS_CLEARANCE : Export & Import Clearance Complete
    CUSTOMS_CLEARANCE --> DELIVERED_BUYER : Proof of Delivery at Buyer Receiving Dock
    DELIVERED_BUYER --> BUYER_INSPECTED_ACCEPTED : Inward Receiving QA Accepted
    BUYER_INSPECTED_ACCEPTED --> ORDER_CLOSED : Final Payment Settlement
    ORDER_CLOSED --> [*]

    %% Discrepancy & NCR Flows
    IN_PROCESS_INSPECTION --> NCR_QUARANTINE : Dimensional Defect / Out of Tolerance
    FINAL_INSPECTION --> NCR_QUARANTINE : CMM Failure / Surface Flaw
    NCR_QUARANTINE --> IN_PROCESS_MACHINING : Disposition: Rework Authorized
    NCR_QUARANTINE --> MATERIAL_SOURCING : Disposition: Scrap & Remake Authorized
```

---

## 3. Detailed Stage Criteria & Preconditions

| State Index | State Identifier | Required Action / Precondition to Advance |
| :---: | :--- | :--- |
| **01** | `PO_RECEIVED` | Buyer digitally signs proposal and uploads formal Purchase Order. |
| **02** | `SUPPLIER_ACCEPTED` | Shortlisted supplier confirms capacity, tooling availability, and delivery date SLA. |
| **03** | `TOOLING_FIXTURES` | Custom jaws, fixtures, carbide cutters, and CNC programs (G-code) are verified. |
| **04** | `MATERIAL_SOURCING` | Certified aerospace-grade raw mill billet received with mill test report (MTR). |
| **05** | `MATERIAL_INWARD_QA` | Chemical composition and mechanical properties verified against ASTM/AMS standards. |
| **06** | `PRODUCTION_STAGED` | CNC machine assigned, material clamped, and traveler traveler package printed. |
| **07** | `IN_PROCESS_MACHINING` | Roughing, semi-finishing, and finishing milling/turning operations running. |
| **08** | `IN_PROCESS_INSPECTION` | First-off sample inspected; in-process dimensional log logged. |
| **09** | `SURFACE_TREATMENT` | Nadcap-approved special processing (anodizing, heat treat, zinc plating, passivation). |
| **10** | `FINAL_INSPECTION` | 100% critical GD&T features inspected via Zeiss/Mitutoyo CMM probe. |
| **11** | `QUALITY_DOSSIER_COMPLETE` | All 6 mandatory compliance artifacts compiled and uploaded to portal. |
| **12** | `READY_TO_SHIP` | **Hard Quality Gate Passed**: All documents approved by Lambda Quality Lead (or authorized override). |
| **13** | `DISPATCHED_ORIGIN` | Crated parts handed over to origin logistics forwarder; AWB generated. |
| **14** | `INTERNATIONAL_TRANSIT` | Air freight in flight (e.g. BOM ➔ FRA ➔ ORD) with telemetry updates. |
| **15** | `CUSTOMS_CLEARANCE` | Harmonized Tariff System (HTS) clearance completed; duties settled. |
| **16** | `DELIVERED_BUYER` | Physical parcel signed for at buyer receiving dock (POD attached). |
| **17** | `BUYER_INSPECTED_ACCEPTED`| Buyer inward QA inspects lot and logs digital acceptance sign-off. |
| **--** | `ORDER_CLOSED` | Financial settlement completed; supplier scorecard updated. |

---

## 4. Non-Conformance (NCR) & Quarantine Workflow

When an inspection reveals dimensions or features outside specified engineering tolerances:

1. **Immediate Quarantine**: The lot immediately transitions to `NCR_QUARANTINE`.
2. **Shop Floor Hold**: Further processing on the machine is immediately frozen.
3. **8D Problem Solving Dossier**:
   - D1: Team formation
   - D2: Defect description (drawing nominal, drawing tolerance, measured dimension, affected quantity)
   - D3: Containment plan (quarantined serial numbers)
   - D4: Root-cause analysis (e.g. tool deflection, carbide insert wear, thermal expansion)
   - D5–D8: Corrective action, preventative action, and verification.
4. **Authorized Dispositions**:
   - **Rework**: Route back to `IN_PROCESS_MACHINING` (e.g., additional skim pass to bring oversized diameter into spec).
   - **Scrap & Remake**: Route back to `MATERIAL_SOURCING` (e.g., wall milled below minimum thickness).
   - **Concession (Use As-Is)**: Requires formal written buyer waiver and supervisor override.

---

## 5. Implementation Rules for Agents
- **Architect & Backend Agent**: The state enum must match these 17 keys exactly. Do not invent arbitrary intermediate states. Ensure state mutations emit immutable event logs.
- **Frontend Agent**: Use the 17-State Precision Progress Stepper defined in [Rule 05: Design System Telemetry](file:///f:/AI-Project/.agents/rules/05-design-system-telemetry.md) with color coding (Emerald for done, Cyan for active, Crimson for locked/NCR, Slate for future).
- **QA Agent**: Test valid forward transitions, reject invalid transitions, and verify NCR branch routes back to the correct stage.
