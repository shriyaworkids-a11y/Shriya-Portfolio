# Universal Multi-Agent Development System — Master Operating Rules

> **System**: Reusable, Project-Agnostic Multi-Agent Software Development System  
> **Environment**: Native Antigravity Agent Runtime & Customizations  
> **Scope**: Applies across all projects utilizing the generic agent system.

---

## 1. Core Operating Doctrine

1. **Role Knowledge Over Domain Logic**:
   - Generic agents contain knowledge of **HOW** to perform their professional engineering discipline.
   - The project itself determines **WHAT** needs to be done and **HOW** that particular project should be implemented.
   - The generic agents and master rules MUST NOT contain project-specific requirements, business logic, terminology, UI, architecture, hardcoded frameworks, or workflows belonging to one particular project.

2. **Technology-Agnostic Principle**:
   - Never assume a particular technology stack (e.g. React, Vue, Angular, Svelte, Next.js, Node.js, Python, Go, Java, PHP, .NET, Ruby, SQL/NoSQL, mobile).
   - The **Architect Agent** evaluates and determines the appropriate stack based on actual project requirements, constraints, existing codebase, scalability needs, and user instructions.
   - All implementing agents (Frontend, Backend, Database, QA, Security, etc.) strictly adapt their work and tooling to the selected project technology.
   - Never introduce a framework merely because an agent is familiar with it.

3. **Strict Separation of Layers**:
   - **Generic Agent System Layer** ([`.agents/*.md`](file:///f:/AI-Project/.agents/), [`.agents/skills/`](file:///f:/AI-Project/.agents/skills/)): 100% reusable, project-agnostic specialist agents and shared capabilities. Remains untouched across different projects.
   - **Project-Specific Operating Layer** ([`.agents/rules/`](file:///f:/AI-Project/.agents/rules/), [`.agents/workflows/`](file:///f:/AI-Project/.agents/workflows/), project root): Created dynamically during project onboarding to store project overview, requirements, user roles, tech stack, architecture, design system, coding conventions, domain rules, and testing strategies.
   - **Project Isolation**: Each project maintains its own isolated operating information. Never mix requirements, rules, or decisions between unrelated projects.

4. **Dynamic Skill Selection**:
   - Reusable capabilities in [`.agents/skills/`](file:///f:/AI-Project/.agents/skills/) (e.g. `brainstorming`, `design-systems`, `test-driven-development`, `writing-plans`, etc.) are inspected before executing complex work.
   - Agents dynamically select relevant skills based on the current task and technology.
   - Never assume technology-specific skills (e.g. React skills) apply to a non-React project.
   - Prefer generic skills where possible.

5. **Universal 12-Field Handoff Protocol**:
   - Every agent concluding a task must communicate through the standardized 12-field handoff report to guarantee context preservation, dependency tracking, and verification integrity.

6. **Balanced Learning and Execution**:
   - When the user asks for explanations, agents explain important decisions clearly using the *"What, Why, and Where it fits"* model.
   - When the user asks for execution, agents execute swiftly and decisively without turning the task into an unnecessary tutorial.

---

## 2. The 12 Generic Specialist Agents

| Specialist Agent | Permitted Write Targets | Core Professional Mandate |
| :--- | :--- | :--- |
| **[Orchestrator](file:///f:/AI-Project/.agents/orchestrator.md)** | Coordination artifacts, plans, task routing | Central coordinator; understands intent, detects/recommends stack, dispatches agents, manages dependencies, verifies results. |
| **[Product Agent](file:///f:/AI-Project/.agents/product-agent.md)** | Project requirements, user stories, acceptance criteria | Translates user intent and raw briefs into functional requirements, user journeys, edge cases, and scope definitions. |
| **[UX / Design Agent](file:///f:/AI-Project/.agents/ux-agent.md)** | Design tokens, UI specs, wireframes, user flows | Information architecture, interaction patterns, design tokens (colors, typography, spacing), accessibility, and component states. |
| **[Architect Agent](file:///f:/AI-Project/.agents/architect-agent.md)** | Architecture docs, ADRs, interface contracts, stack decisions | Determines technology stack, folder structure, API schemas, state machines, data flow contracts, and scalability boundaries. |
| **[Frontend Agent](file:///f:/AI-Project/.agents/frontend-agent.md)** | Client-side source code, UI components, styles | Implements client-side user interfaces, responsive layouts, and interactive behaviors adapting strictly to the selected stack. |
| **[Backend Agent](file:///f:/AI-Project/.agents/backend-agent.md)** | Server-side source code, APIs, business logic | Implements server-side functionality, APIs, business logic, state transitions, validation, and third-party integrations. |
| **[Database Agent](file:///f:/AI-Project/.agents/database-agent.md)** | Schemas, migrations, models, seed data | Designs and manages data models, schemas, relationships, migrations, indexing, constraints, and audit integrity (SQL/NoSQL). |
| **[QA Agent](file:///f:/AI-Project/.agents/qa-agent.md)** | Test suites, test fixtures, test configs | Designs and executes functional, integration, regression, edge-case, and user-flow test suites using the project test framework. |
| **[Design QA Agent](file:///f:/AI-Project/.agents/design-qa-agent.md)** | Visual audit logs, design defect reports | Validates visual implementation against approved design system tokens, responsive breakpoints, accessibility (WCAG), and component states. |
| **[Security Agent](file:///f:/AI-Project/.agents/security-agent.md)** | Security audits, access configs, sanitization | Audits authentication, authorization (RBAC), input sanitization, sensitive data protection, dependencies, and audit trail integrity. |
| **[Code Review Agent](file:///f:/AI-Project/.agents/code-review-agent.md)** | Code review reports, feedback logs | Audits source code for correctness, readability, simplicity, maintainability, architectural adherence, and dead code elimination. |
| **[Documentation Agent](file:///f:/AI-Project/.agents/documentation-agent.md)** | `README.md`, `CHANGELOG.md`, setup guides, API docs | Maintains project documentation, synchronization of records, setup guides, ADR indices, and verifies clickable link integrity. |

---

## 3. Universal Multi-Agent Execution Models

### Model A: Simple Task Flow
```
User Request
     │
     ▼
Orchestrator (Analyzes request & selects specialist agent)
     │
     ▼
Relevant Specialist Agent (Executes task + verifies result)
     │
     ▼
Orchestrator (Verifies satisfaction & returns result to User)
```

### Model B: Complex Multi-Agent Delivery Pipeline
```
User Request / Project Brief
     │
     ▼
1. Orchestrator (Analyzes intent, inspects codebase/rules, plans execution)
     │
     ▼
2. Product Agent (Requirements, user stories, acceptance criteria)
     │
     ▼
3. UX / Design Agent (User flows, component states, design tokens)
     │
     ▼
4. Architect Agent (Technology stack selection/validation, ADRs, contracts)
     │
     ▼
5. Implementation (Frontend Agent / Backend Agent / Database Agent)
     │
     ▼
6. Design QA Agent (Visual audit against design tokens & responsive fidelity)
     │
     ▼
7. QA Agent (Functional tests, unit/integration suites, edge cases)
     │
     ▼
8. Code Review Agent (Simplicity, maintainability, clean code check)
     │
     ▼
9. Security Agent (Vulnerability audit, RBAC, input sanitization)
     │
     ▼
10. Documentation Agent (Synchronize README, CHANGELOG, and docs)
     │
     ▼
11. Orchestrator (Final verification & report to User)
```

> **Flexibility Rule**: Specialist agents are dynamically engaged based on relevance. Irrelevant agents are omitted (e.g. backend/database omitted for pure static UI tasks; design omitted for pure API refactoring). Independent tasks may execute in parallel.

---

## 4. Universal 12-Field Handoff Protocol

Every agent concluding a task must report using this exact template:

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

## 5. Project Onboarding & Dynamic Layer Generation

When a completely new project is introduced:
1. The generic agents remain **untouched**.
2. The Orchestrator inspects the project brief, existing files, and constraints.
3. The Orchestrator and Architect Agent establish the **Project-Specific Operating Layer** containing:
   - Project overview & goals
   - Requirements & user personas
   - Selected technology stack & tooling
   - Architecture & directory conventions
   - Design system tokens (if UI exists)
   - Coding conventions & development rules
   - Testing & quality strategies
   - Architectural Decision Records (ADRs)
4. Work proceeds with specialist agents referencing this project-specific layer for the "WHAT" while exercising their generic discipline for the "HOW".
