# Rule 03: Commercial Shielding & Anonymity Protocol

> **Domain Scope**: Multi-Tenant Isolation, Commercial Confidentiality, Vendor of Record  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Rule 09: Personas & Portals](file:///f:/AI-Project/.agents/rules/09-personas-and-portals.md)

---

## 1. The Commercial Shielding Principle

Lambda operates as the **sole commercial and technical orchestrator (Vendor of Record)** between Western OEM buyers (aerospace, defense, medical, semiconductor) and precision Indian manufacturing partners.

> [!IMPORTANT]
> **Complete Commercial Shielding Invariant**:
> 1. Western OEMs must NEVER be exposed to raw supplier corporate identities, facilities' direct contact details, or raw supplier production cost breakdowns.
> 2. Indian Precision Suppliers must NEVER be exposed to buyer direct contact details, commercial contract terms with the end-client, or Lambda's internal gross margin structures.
> 3. All technical, contractual, and physical exchanges must be mediated through Lambda Operations.

---

## 2. Supplier Anonymization Rules in Buyer Portal

When displaying manufacturing capabilities, machine configurations, or audit histories in the Buyer Portal:

### Prohibited Disclosures (Buyer-Facing):
- ❌ Supplier Corporate Name (e.g. *"Precision Parts Manufacturing Pvt Ltd"*).
- ❌ Physical Address, Tax ID (GSTIN), or Website URLs.
- ❌ Direct phone numbers or email addresses of shop floor personnel.
- ❌ Direct communication channels or unmoderated chat interfaces.

### Permitted Abstracted Format:
All supplier facility representations must strictly follow the **Certified Cluster Profile Template**:
```
"Lambda Certified Facility #{ClusterCode}-{FacilityId} ({RegionalCluster})"
```
**Examples**:
- `Lambda Certified Facility #IN-402 (Bangalore Precision Aerospace Cluster)`
- `Lambda Certified Facility #IN-118 (Hyderabad Defense & Space Machining Hub)`
- `Lambda Certified Facility #IN-205 (Pune Precision Swiss & EDM Center)`

### Permitted Technical Disclosures to Buyer:
- ✅ Certified equipment types and models (e.g. *"5-Axis DMG Mori NMV 5000, Zeiss Contura CMM"*).
- ✅ Active accreditations (e.g. *"AS9100 Rev D, ISO 9001:2015, Nadcap Chemical Processing"*).
- ✅ Anonymous historical performance metrics (e.g. *"96.4% On-Time Delivery, 18 completed Titanium lots, 12 PPM defect rate"*).

---

## 3. Financial & Margin Isolation Rules

### 1. Supplier Portal Financial Rules:
- The supplier sees only the **Supplier PO Value** (the price Lambda pays the supplier for machining, raw stock, tooling, and inspection).
- The supplier has no visibility into what Lambda quotes or charges the end buyer.

### 2. Operations Portal Margin Engine:
- Only authorized Lambda Operations roles (Operations Director, Senior Sourcing Lead) can view both raw supplier bids and the margin engine.
- The Margin Builder applies:
  - Base supplier quote
  - Logistics, air/ocean freight, insurance, and duty calculation
  - Custom tooling & NRE amortization
  - Lambda Gross Margin % (slider or target gross profit)
  - Unified buyer piece price proposal.

### 3. Buyer Portal Financial Rules:
- The buyer sees only the **Consolidated Lambda Proposal**:
  - Unit piece price at specified volume tiers (e.g. 1,000 / 5,000 / 10,000 units)
  - Non-Recurring Engineering (NRE) charges (fixtures, gauges, AS9102 FAIR setup)
  - Guaranteed DDP/CIF lead time
  - Payment terms (e.g. Net 30 from delivery).

---

## 4. Technical Communication Mediation

If an engineering drawing has an ambiguous dimension or DFM conflict:
1. The supplier does **not** email the buyer directly.
2. The supplier logs a **Technical Clarification Request (TCR)** in the Supplier Portal.
3. A Lambda Technical Manufacturing Engineer (TME) reviews the TCR.
4. If valid, the TME reformats the inquiry as a formal Lambda Engineering Query to the buyer.
5. The buyer's clarification is reviewed by the TME before transmitting the resolution to the supplier.

---

## 5. Implementation Rules for Agents
- **Frontend Agent**: Never reuse raw supplier data objects in buyer components. Sanitize data payloads so sensitive keys (`supplier_name`, `supplier_tax_id`, `supplier_phone`, `supplier_base_cost`) are omitted or scrubbed before rendering buyer views.
- **Backend & Database Agent**: Enforce role-based access control (RBAC). A user session with role `BUYER` must never be returned JSON objects containing unshielded supplier identity fields or internal margin formulas.
- **QA & Security Agents**: Perform audits to ensure that API responses to buyer tokens do not leak supplier names or unmoderated cost structures.
