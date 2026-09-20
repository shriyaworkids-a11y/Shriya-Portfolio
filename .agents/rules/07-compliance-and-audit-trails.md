# Rule 07: Aerospace Compliance & Immutable Audit Trails

> **Domain Scope**: Regulatory Compliance, Quality Accreditations, Event Audit Logging  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Rule 09: Personas & Portals](file:///f:/AI-Project/.agents/rules/09-personas-and-portals.md)

---

## 1. Aerospace & Defense Regulatory Landscape

Lambda operates at the intersection of mission-critical engineering standards. All software mechanisms, data schemas, and file storage must respect:

| Standard | Governing Body | Domain Scope |
| :--- | :--- | :--- |
| **AS9100 Rev D** | IAQG / SAE | Quality Management Systems — Requirements for Aviation, Space, and Defense Organizations. |
| **SAE AS9102** | SAE International | Aerospace First Article Inspection Requirement (FAIR Forms 1, 2, and 3). |
| **ISO 9001:2015** | ISO | Quality management systems — Requirements. |
| **ISO 13485:2016** | ISO | Medical devices — Quality management systems for regulatory purposes. |
| **Nadcap** | PRI (Performance Review Institute) | Special processes: Heat treating, chemical processing (anodizing, plating), NDT, welding. |
| **ITAR / EAR** | US Dept of State / Commerce | International Traffic in Arms Regulations / Export Administration Regulations. |

---

## 2. Immutable Event Stream & Chronological Audit Log (Module K / O58)

Every operational action, quality verification, state transition, and AI override must be recorded in an append-only, tamper-resistant chronological audit log.

> [!CAUTION]
> **Audit Integrity Invariant**:  
> Audit log records are strictly immutable. No API, user, or background script may update, modify, or delete existing audit events.

### Standard Audit Event Schema:
```json
{
  "event_id": "evt_99b7c2a1-0f2d-4e9b",
  "timestamp": "2026-09-02T10:45:12.304Z",
  "actor": {
    "user_id": "usr_ops_arjun_07",
    "role": "OPERATIONS_CONTROLLER",
    "name": "Arjun Mehta",
    "portal": "LAMBDA_OPS"
  },
  "entity": {
    "type": "ORDER",
    "id": "ORD-58241",
    "part_number": "AX-204-REV-B"
  },
  "action": "QUALITY_GATE_VERIFICATION",
  "details": {
    "document_type": "AS9102_FAIR",
    "document_id": "DOC-FAIR-44910.pdf",
    "prior_status": "PENDING_VERIFICATION",
    "new_status": "VERIFIED",
    "ballooned_characteristics_verified": 42,
    "discrepancies_found": 0
  },
  "rationale": "CMM correlation verified 100% within tolerance.",
  "security": {
    "ip_address": "192.168.1.45",
    "signature_hash": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  }
}
```

---

## 3. Mandatory Compliance Invariants

1. **Lot Traceability Retention**:
   - Aerospace and defense records (MTRs, heat treat charts, CMM reports, FAIR packages) must be retained and linked to part serial numbers for a minimum of **10 years** (or lifecycle of the aircraft/defense program).
2. **Export Control (ITAR / EAR) Declarations**:
   - RFQs flagged with `ITAR_RESTRICTED` or `EAR99` require explicit export licensing review before CAD/drawing packages can be dispatched to suppliers.
   - Non-US supplier facilities must have active, vetted technical assistance agreements (TAA) or applicable exemption documentation on file.
3. **Dual Verification for Concessions**:
   - Any disposition to "Use As-Is" for out-of-tolerance dimensions requires documented customer engineering concession sign-off uploaded and permanently tethered to the lot's Quality Dossier.

---

## 4. Implementation Rules for Agents
- **Database Agent**: Design audit tables with append-only access controls (no `UPDATE` or `DELETE` grants).
- **Backend Agent**: Always emit an audit event inside the same transaction as any critical state change, document approval, or override.
- **Security Agent**: Validate that audit streams include cryptographic integrity checks and verify that ITAR-controlled assets are gated by role permissions.
