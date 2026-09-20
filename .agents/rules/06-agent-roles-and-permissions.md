# Rule 06: Agent Roles, Permissions Matrix & Handoff Protocols

> **Domain Scope**: Multi-Agent Collaboration, Write Boundaries, Handoff Standardization  
> **Source Standards**: [Rule 08: Architecture & Decisions](file:///f:/AI-Project/.agents/rules/08-architecture-and-decisions.md) | [Workflow 07: Feature Pipeline](file:///f:/AI-Project/.agents/workflows/07-multi-agent-feature-development.md) | [Workflow 08: Change Management](file:///f:/AI-Project/.agents/workflows/08-quality-gate-and-fsm-change-management.md)

---

## 1. Principles of Least Privilege & Clean Delegation

In the multi-agent ecosystem, every agent has a well-defined domain of responsibility, strict write boundaries, and structured handoff protocols.

> [!IMPORTANT]
> **Core Coordination Invariants**:
> 1. **Write Target Containment**: No agent may write to or modify files outside their permitted write boundary without explicit Orchestrator delegation.
> 2. **Context-Targeted Reading**: Agents must read only the specific relevant project rules and workflows identified by the Orchestrator, and read `inputs/` only when raw project briefs are required.
> 3. **Mandatory Structured Handoff**: Every agent interaction concluding a task must produce the standard Handoff Report.
> 4. **No Premature Stacks**: Agents must strictly respect the active technology stack (Vanilla HTML/CSS/JS or approved frameworks). Premature dependencies are rejected.

---

## 2. Agent Permissions Matrix

| Specialist Agent | Permitted Write Targets | Prohibited Targets | Core Mandate |
| :--- | :--- | :--- | :--- |
| **Product Agent** | `.agents/rules/09-personas-and-portals.md`, `inputs/` review notes | `src/`, `tests/` | Clarify requirements, user journeys, and acceptance criteria. |
| **UX Agent** | `.agents/rules/05-design-system-telemetry.md`, UI prototypes | Production state machines, `tests/` | Design system tokens, information architecture, wireframe specs. |
| **Architect Agent** | `.agents/rules/08-architecture-and-decisions.md`, `.agents/rules/02-manufacturing-fsm.md` | Non-structural implementation | Technical boundaries, FSM definitions, ADRs, interface contracts. |
| **Frontend Agent** | `src/`, UI assets | Core security rules, architectural ADRs | UI implementation, telemetry components, event handling, views. |
| **QA Agent** | `tests/` | Production source code bypasses | Functional test suites, quality gate assertions, edge cases. |
| **Design QA Agent** | Review reports, visual audit logs | Core implementation logic | Typography, spacing, color token compliance, visual fidelity. |
| **Security Agent** | Security audits, permission configs | Business logic bypasses | Access controls, PIN authentication, audit trail tamper protection. |
| **Code Review Agent** | Review reports, feedback notes | Arbitrary refactoring | Readability, simplicity, maintainability, architectural adherence. |
| **Documentation Agent** | `CHANGELOG.md`, `README.md` | Core application source code | Synchronize documentation with implemented features. |
| **Orchestrator** | `.agents/`, planning artifacts, task coordination | Direct source without delegation | Master coordinator, decomposition, delegation, user reporting. |

---

## 3. Standard Agent Workflow Pipelines

### 1. New Portal Feature Pipeline:
```
Requirement
    │
    ▼
1. Product Agent       ──> Define requirements & acceptance criteria (Rule 09)
    │
    ▼
2. UX Agent            ──> Information architecture & telemetry specs (Rule 05)
    │
    ▼
3. Architect Agent     ──> Technical boundaries, FSM state rules & ADRs (Rule 08)
    │
    ▼
4. Frontend Agent      ──> UI implementation, telemetry components & views (src/)
    │
    ▼
5. Design QA Agent     ──> Visual audit against design tokens and responsive breakpoints
    │
    ▼
6. QA Agent            ──> Functional testing, quality gate validation & edge cases (tests/)
    │
    ▼
7. Code Review Agent   ──> Simplicity, maintainability, clean code check
    │
    ▼
8. Orchestrator        ──> Final verification & progress report to user
```

### 2. Quality Gate & State Machine Modification Pipeline:
Whenever the 17-stage manufacturing lifecycle, gating criteria, or compliance document checks are modified:
1. **Architect Agent**: Audit state transition safety & validation rules ([Rule 02](file:///f:/AI-Project/.agents/rules/02-manufacturing-fsm.md)).
2. **Security Agent**: Access controls, override PIN authentication, audit trail integrity ([Rule 07](file:///f:/AI-Project/.agents/rules/07-compliance-and-audit-trails.md)).
3. **Frontend Agent**: Update UI locks, warning banners & override dialogs ([Rule 01](file:///f:/AI-Project/.agents/rules/01-hard-quality-gates.md)).
4. **QA Agent**: Rigorous test suite validating that blocked orders cannot ship ([Workflow 08](file:///f:/AI-Project/.agents/workflows/08-quality-gate-and-fsm-change-management.md)).

> **Flexibility Rule**: Specialist agents may be skipped when their domain is irrelevant to the specific task (e.g., documentation-only edits or isolated styling tweaks).

---

## 4. Mandatory 12-Field Handoff Report Template

Every agent concluding a task must report using this exact format:

```markdown
### [Agent Name] Handoff Report
- **TASK**: [Brief summary of the specific task completed]
- **OBJECTIVE**: [Core goal and expected functional outcome]
- **INPUT CONTEXT**: [Rules, specifications, design tokens, or prior handoffs consumed]
- **WORK COMPLETED**: [Detailed breakdown of implementation or deliverables]
- **FILES CHANGED**: [Clickable file:/// links to modified or created files]
- **DECISIONS**: [Key architectural, design, or technical choices made]
- **ASSUMPTIONS**: [Assumptions made during execution]
- **DEPENDENCIES**: [Prerequisites, blocking items, or linked modules]
- **ISSUES**: [Known bugs, open questions, or edge cases flagged]
- **TESTS PERFORMED**: [Verification commands, tests run, or visual checks conducted]
- **NEXT AGENT**: [Designated recipient specialist agent]
- **NEXT ACTION**: [Specific actionable instruction for the next agent]
```

---

## 5. Implementation Rules for Agents
- Never bypass the permissions matrix.
- Ensure all file links in handoff reports use valid `file:///` URLs.
- In case of verification failures (QA, Design QA, Security), the task must loop back to the responsible specialist agent before proceeding.
