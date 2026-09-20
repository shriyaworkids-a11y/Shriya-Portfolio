# Skill authoring best practices

> Learn how to write effective Skills that agents can discover and use successfully.

Good Skills are concise, well-structured, and tested with real usage. This guide provides practical authoring decisions to help you write Skills that agents can discover and use effectively.

## Core principles

### Concise is key

The context window is a public good. Your Skill shares the context window with everything else your agent needs to know:
* The system prompt
* Conversation history
* Other Skills' metadata
* The user's actual request

At startup, only the metadata (name and description) from all Skills is pre-loaded. Agents read `SKILL.md` only when the Skill becomes relevant, and read additional files only as needed. However, being concise in `SKILL.md` still matters: once an agent loads it, every token competes with conversation history and other context.

**Default assumption: Agents are already very smart**

Only add context agents don't already have. Challenge each piece of information:
* "Does the agent really need this explanation?"
* "Can I assume the agent knows this?"
* "Does this paragraph justify its token cost?"

### Set appropriate degrees of freedom

Match the level of specificity to the task's fragility and variability:

1. **High freedom** (text-based heuristics): Use when multiple approaches are valid and decisions depend on context (e.g. code review heuristics).
2. **Medium freedom** (templates/pseudocode with parameters): Use when a preferred pattern exists with some flexibility.
3. **Low freedom** (specific scripts, zero variation): Use when operations are fragile, error-prone, or strict ordering is essential (e.g. database migrations, security cryptographic routines).

## Skill Structure & Progressive Disclosure

Keep `SKILL.md` body concise (ideally under 500 lines) and one level deep:
- `SKILL.md` (overview and triggers)
- `reference/` or supporting files (detailed references, loaded on-demand)
- `scripts/` (executable tools, executed rather than read into context)

### Naming Conventions

Use consistent gerund form (verb + -ing) for Skill directory names:
- `writing-skills`
- `condition-based-waiting`
- `processing-pdfs`

### Writing Effective Descriptions

- Always write in third person.
- Focus strictly on triggering conditions ("Use when...").
- Do NOT summarize the internal workflow in the description, as agents will follow the summary instead of reading the complete skill.
