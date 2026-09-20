# Universal Multi-Agent Development Workflows

> **System Scope**: Reusable, Project-Agnostic Software Delivery Pipelines & Multi-Agent Coordination Protocols  
> **Authoritative Rules**: [AGENTS.md](file:///f:/AI-Project/.agents/AGENTS.md)  
> **Environment**: Native Antigravity Multi-Agent Architecture

---

## 1. Workflows Architecture Overview

The multi-agent workflow engine orchestrates collaboration among the 12 specialist agents across any project. Workflows are divided into three tiers:

1. **Lifecycle Workflows**: Project onboarding, stack determination, and layer separation.
2. **Execution Pipelines**: Simple task routing and complex multi-agent feature delivery.
3. **Assurance & Feedback Loops**: Defect remediation, quality gate assertions, and architectural evolution.

---

## 2. Core Workflows Index

```
.agents/
├── AGENTS.md                  # Master Agent Operating Rules
├── WORKFLOWS.md               # Master Workflows Architecture (This File)
├── orchestrator.md            # Central Coordinator Agent
├── [specialist-agents].md     # 11 Generic Specialist Roles
├── skills/                    # Reusable Agent Capabilities Library
└── rules/                     # Active Project-Specific Operating Layer (Project Rules & ADRs)
```

---

## 3. Workflow 01: Project Onboarding & Layer Generation

When the user introduces a new project (or provides raw briefs/codebase):

```
User Prompt / Project Brief
       │
       ▼
1. Orchestrator: Project Inspection
   - Assess if new or existing project
   - Scan root directory, dependencies, and file structures
       │
       ▼
2. Architect Agent: Stack Determination & Scaffolding
   - If stack exists: Identify frameworks, runtime, build tools, package managers
   - If new project: Analyze requirements and recommend optimal stack with ADR
       │
       ▼
3. Product & UX Agents: Operating Layer Generation
   - Product Agent: Generate project requirements, personas, and user journeys
   - UX Agent: Generate design tokens (colors, typography, spacing) if UI is required
       │
       ▼
4. Documentation Agent: Project Baseline Synchronization
   - Initialize project README, setup guide, and project rules in .agents/rules/
       │
       ▼
5. Orchestrator: Onboarding Complete & Ready for Tasks
```

---

## 4. Workflow 02: Simple Task Execution Pipeline

For single-discipline tasks (e.g. isolated bug fix, styling tweak, documentation update, unit test addition):

```
User Request
     │
     ▼
1. Orchestrator
   - Identify task scope and designate the single relevant specialist agent
   - Pass relevant project context and file references
     │
     ▼
2. Specialist Agent (Frontend / Backend / QA / Docs, etc.)
   - Inspect existing implementation and relevant skills
   - Execute the task cleanly within permitted write boundaries
   - Verify changes locally (tests, rendering, or lint)
   - Produce 12-field Handoff Report
     │
     ▼
3. Orchestrator
   - Verify deliverables against user intent
   - Report final outcome directly to User
```

---

## 5. Workflow 03: Complex Multi-Agent Delivery Pipeline

For full features, substantial refactors, or new component architectures:

```
User Feature Request
        │
        ▼
1. Orchestrator ────────────> Task decomposition, plan generation, agent & skill selection
        │
        ▼
2. Product Agent ───────────> Functional requirements, user stories, acceptance criteria
        │
        ▼
3. UX / Design Agent ───────> Information architecture, component states, design tokens
        │
        ▼
4. Architect Agent ─────────> Technical contracts, state machine logic, ADRs, module boundaries
        │
        ▼
5. Implementation ──────────> Frontend Agent / Backend Agent / Database Agent (in parallel or sequence)
        │
        ▼
6. Design QA Agent ─────────> Visual audit against design tokens, responsive breakpoints, accessibility
        │
        ▼
7. QA Agent ────────────────> Functional test suites, edge cases, integration verification
        │
        ▼
8. Code Review Agent ───────> Readability, simplicity, maintainability, architectural adherence
        │
        ▼
9. Security Agent ──────────> Input sanitization, RBAC, secret protection, vulnerability audit
        │
        ▼
10. Documentation Agent ────> Synchronize README, CHANGELOG, API docs, verify file:/// links
        │
        ▼
11. Orchestrator ────────────> Final verification, summary report to User
```

---

## 6. Workflow 04: Quality Gate & Remediation Loop

When an assurance agent (Design QA, QA, Code Review, or Security) flags a defect, failure, or compliance breach:

```
Assurance Agent (Fails verification with objective log)
       │
       ▼
12-Field Handoff Report with VERDICT: FAILED / CORRECTION NEEDED
       │
       ▼
Orchestrator: Intercepts Failure
       │
       ▼
Route task back to the Responsible Implementing Agent (Frontend / Backend / DB)
       │
       ▼
Implementing Agent applies fix with targeted regression test
       │
       ▼
Assurance Agent re-verifies until VERDICT: PASSED
       │
       ▼
Pipeline resumes downstream progression
```

---

## 7. Workflow 05: Dynamic Skill Selection Protocol

Before executing complex tasks, the Orchestrator and specialist agents follow this selection discipline:

1. **Inspect Available Skills**: Review [`.agents/skills/`](file:///f:/AI-Project/.agents/skills/) to find reusable capabilities.
2. **Match Technology & Domain**:
   - For UI design/tokens: activate `design-systems`.
   - For planning/ideation: activate `brainstorming`, `writing-plans`.
   - For testing: activate `test-driven-development`.
   - For parallel independent tasks: activate `dispatching-parallel-agents`.
   - For React-based projects: activate `react-best-practices`, `react-patterns`, `react-ui-patterns` (ONLY when the project stack is React).
3. **Reject Irrelevant Skills**: Never apply framework-specific skills to incompatible project stacks.
4. **Execute & Learn**: Agents combine skill capabilities with their role discipline to deliver optimal results.
