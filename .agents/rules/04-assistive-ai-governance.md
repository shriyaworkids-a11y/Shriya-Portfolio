# Rule 04: Assistive AI Governance & Explainability Doctrine

> **Domain Scope**: AI Extraction, Supplier Matchmaking, Algorithmic Transparency, Human Override  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Rule 09: Personas & Portals](file:///f:/AI-Project/.agents/rules/09-personas-and-portals.md)

---

## 1. The Assistive, Never Autonomous AI Doctrine

In mission-critical aerospace, defense, and medical robotics manufacturing, unverified automated actions and LLM hallucinations carry severe financial, legal, and human-safety risks.

> [!IMPORTANT]
> **Assistive AI Invariants**:
> 1. **No Autonomous Decisions**: AI never autonomously commits an engineering drawing, awards a contract to a supplier, modifies a tolerance, or approves a quality gate.
> 2. **Explicit Confidence & Source Grounding**: Every AI extraction must display its calculated confidence percentage and link directly to the underlying drawing coordinate or CAD bounding box.
> 3. **Mandatory Human Verification**: AI suggestions must remain in a `PENDING_VERIFICATION` state until an engineer or operator explicitly clicks "Verify" or "Edit".
> 4. **Frictionless Human Override**: Operators always have 100% authority to override, adjust, or completely disregard any AI recommendation.

---

## 2. Drawing & CAD Parameter Extraction Rules

When processing 2D drawings (.PDF, .DXF) and 3D CAD models (.STEP, .IGES):

1. **Extraction Attributes**:
   - Material alloy grade (e.g. `Ti-6Al-4V Grade 5 / AMS 4928`, `Inconel 718`, `Al 7075-T6`)
   - Critical linear and geometric (GD&T) tolerances (e.g. `±0.010 mm`, true position `⌀0.02 mm`)
   - Surface finish / roughness (e.g. `Ra 0.8 µm`, `Ra 1.6 µm`)
   - Special surface treatments / coatings (e.g. `Hard Anodize Type III`, `Electroless Nickel Plating`, `Vacuum Heat Treat 38-42 HRC`)
   - Inspection requirements (e.g. `100% CMM`, `AS9102 FAIR`, `MTR Heat Lot Traceability`).
2. **Visual AI Extraction Component**:
   Extracted parameters must render using the standard UI pattern:
   ```html
   <span class="ai-badge ai-badge--pending">
     <span class="ai-sparkle-icon">✨</span>
     <span class="ai-label">AI Extracted</span>
     <span class="ai-confidence">98% Confidence</span>
     <button class="btn-verify" title="Verify parameter against drawing">Verify</button>
     <button class="btn-edit" title="Edit extracted value">Edit</button>
   </span>
   ```
3. **State Change**:
   - Once clicked, the badge transitions to `.ai-badge--verified` (Emerald icon: `✓ Verified by Engineer`) or `.ai-badge--modified` (Slate icon: `✎ Manually Edited`).

---

## 3. Assistive AI Supplier Matchmaking Vector Engine

Lambda's supplier recommendation engine evaluates suppliers using a deterministic, 5-vector composite scoring model ($S \in [0, 100]$):

$$S = w_{mach} \cdot C_{mach} + w_{cert} \cdot C_{cert} + w_{mat} \cdot C_{mat} + w_{otd} \cdot C_{otd} + w_{qual} \cdot C_{qual}$$

### Vector Weights and Evaluation Criteria:
| Vector | Weight | Evaluation Criteria |
| :--- | :---: | :--- |
| **$C_{mach}$ (Machine Fit)** | **25%** | Axis configuration (5-axis simultaneous), spindle speed (RPM), work envelope vs. part bounding box (X/Y/Z mm), wire EDM or Swiss turn capability. |
| **$C_{cert}$ (Certifications)** | **25%** | Active AS9100 Rev D, ISO 9001:2015, ISO 13485:2016, and Nadcap accreditations for drawing-specified special processes. |
| **$C_{mat}$ (Material History)** | **20%** | Quantity of successfully manufactured lots using the specific alloy or difficulty group (e.g. superalloys, titanium, refractory metals). |
| **$C_{otd}$ (On-Time Delivery)** | **15%** | Rolling 12-month on-time dispatch rate against agreed factory milestone SLAs. |
| **$C_{qual}$ (Quality Track Record)**| **15%** | Historical PPM defect rate, average FAI first-pass yield, and open NCR count. |

---

## 4. The Explainability Drawer & Operator Override Contract

Black-box match scores are strictly prohibited. Every recommendation must feature an **Explainability Drawer**:

### 1. Granular Evidence Card ("Why this match?"):
- ✓ Active AS9100 Rev D certified (Certificate valid thru Nov 2027)
- ✓ DMG Mori NMV 5000 5-axis mill in-house (Travel: 730 × 500 × 500 mm fits bounding envelope 180 × 120 × 95 mm)
- ✓ Completed 14 aerospace-grade Ti-6Al-4V production lots with 0 defects
- ✓ In-house Zeiss Contura CMM with sub-micron scanning probe
- ✓ 96.4% historical on-time delivery across 14 purchase orders.

### 2. Operator Override Contract:
An Operations Controller may override the AI ranking (pin a lower-ranked supplier or exclude a top-ranked supplier). Every override must record:
```json
{
  "order_id": "ORD-58241",
  "supplier_id": "SUP-IN-402",
  "algorithm_score": 91.5,
  "override_applied": true,
  "operator_id": "OPS-LEAD-007",
  "reason_code": "TOOLING_ALREADY_AVAILABLE",
  "justification_notes": "Facility holds custom fixture jaws from previous 2025 contract, saving $2,400 NRE and 10 days setup.",
  "timestamp": "2026-09-02T10:35:00Z"
}
```

Allowed Reason Codes:
- `CAPACITY_RESERVED`
- `TOOLING_ALREADY_AVAILABLE`
- `COMMERCIAL_PREFERRED`
- `EXPEDITE_PARTNER`
- `CUSTOMER_DESIGNATED_SOURCE`

---

## 5. Implementation Rules for Agents
- **Backend Agent**: Implement the deterministic 5-vector algorithm. Never return a match score without the accompanying granular vector breakdown.
- **Frontend Agent**: Always pair match scores with the Explainability Drawer and one-click manual override trigger.
- **QA Agent**: Write tests ensuring that manual overrides take precedence over algorithmic scores and that audit events are generated upon override.
