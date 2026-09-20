# Persuasion Principles for Skill Design

## Overview

LLMs respond to psychological persuasion principles similar to humans. Understanding this helps you design more effective skills to ensure critical practices are followed even under pressure.

*Research foundation: Meincke et al. (2025) found that persuasion techniques more than doubled AI compliance rates (33% → 72%, p < .001).*

## Key Principles

### 1. Authority
- **What it is**: Deference to expertise, standards, or official guidelines.
- **In Skills**: Use direct, non-negotiable framing ("YOU MUST", "Never", "Always"). Eliminates rationalization.
- **Example**: 
  - ✅ *"Write code before test? Delete it. Start over. No exceptions."*
  - ❌ *"Consider writing tests first when feasible."*

### 2. Commitment
- **What it is**: Consistency with explicit declarations.
- **In Skills**: Require the agent to announce: *"I am using [Skill Name]"*, or force explicit multiple-choice decisions.
- **Example**:
  - ✅ *"When you find a skill, you MUST announce: I am using [Skill Name]."*

### 3. Scarcity & Urgency
- **What it is**: Urgency from sequential limits.
- **In Skills**: Sequence-bound requirements ("Immediately after X, before proceeding"). Prevents procrastination.

### 4. Social Proof & Universal Norms
- **What it is**: Reinforcing that a failure mode is predictable and universal.
- **In Skills**: *"Skipping verification without tests = regression. Every single time."*

### 5. Unity & Partnership
- **What it is**: Shared identity and pair-programming alignment ("We build together", "Our standard").
