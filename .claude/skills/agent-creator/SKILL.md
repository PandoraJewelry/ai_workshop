---
name: agent-creator
description: Creates well-structured Claude Code custom agents from descriptions. Use when the user wants to create a new agent, build a subagent, or make a specialized agent for specific tasks.
allowed-tools: WebSearch, WebFetch, Write, Read, Glob
---

# Agent Creator

Create well-structured Claude Code custom agents (subagents) from natural language descriptions.

## Purpose

Generate AGENT.md files that define specialized agents with appropriate tools, model selection, and clear instructions.

## When to Use

- User wants to create a custom subagent
- User needs a specialized agent for a domain (security, testing, review)
- User wants to create an agent that combines multiple skills
- User needs an agent with restricted tool access

## Instructions

When the user describes an agent they want to create, follow these steps:

### Step 1: Understand the Request

Parse the user's description to identify:
- What domain or task the agent specializes in
- What tools the agent needs (or should be restricted from)
- Whether it should inject existing skills
- What model is appropriate (opus for complex, haiku for fast, sonnet for balanced)

### Step 2: Research Best Practices

Use WebSearch to find:
- Best practices for Claude Code custom agents
- Patterns for the agent's domain (e.g., code review, testing)
- Tool restriction patterns

Summarize 2-3 key insights that should inform the agent design.

### Step 3: Design the Agent Metadata

**Name**: Lowercase, hyphenated, descriptive (becomes the @agent-name reference)

**Description**: Explain what the agent does and when Claude should delegate to it. Include trigger phrases.

**Tools**: Determine required tools based on agent purpose:

| Agent Purpose | Recommended Tools |
|---------------|-------------------|
| Code review | Read, Grep, Glob, Bash(git diff:*) |
| Testing | Read, Write, Bash(npm test:*), Bash(npx playwright:*) |
| Research | Read, Grep, Glob, WebSearch, WebFetch |
| Implementation | Read, Write, Edit, Bash(git:*) |
| Read-only audit | Read, Grep, Glob (no Write/Edit) |

**Model Selection**:

| Complexity | Model | Use When |
|------------|-------|----------|
| High | opus | Complex analysis, architectural decisions |
| Medium | sonnet | Balanced tasks, most use cases |
| Low | haiku | Fast, simple operations |
| Inherit | (omit field) | Use parent conversation's model |

### Step 4: Design Skill Injection (if applicable)

If the agent should use existing skills, use the `skills:` frontmatter field:

```yaml
---
name: agent-name
description: ...
skills:
  - skill-name-1
  - skill-name-2
---
```

The full content of each skill is injected into the subagent's context at startup. Subagents don't inherit skills from the parent conversation, so list them explicitly.

**Important**: Use the skill's `name` field (from its SKILL.md frontmatter), not the directory path.

### Step 5: Write the AGENT.md

Use this structure:

```yaml
---
name: [agent-name]
description: [What it does. When to use it. Trigger phrases.]
tools: [Comma-separated tool list]
model: [sonnet | opus | haiku | omit for inherit]
skills:  # Optional - list skill names to inject
  - skill-name-1
  - skill-name-2
---

# [Agent Title]

[One sentence describing the agent's role]

## Purpose
[What this agent specializes in]

## Process
1. [Step 1]
2. [Step 2]
3. [Continue as needed]

## Output Format
[How results should be structured]

## Constraints
- [Any limitations or rules]
```

### Step 6: Validate with Checklist

Before presenting, verify ALL items:

**Frontmatter**
- [ ] `name` is lowercase with hyphens only
- [ ] `description` explains what and when (under 200 chars)
- [ ] `tools` list is appropriate for the purpose
- [ ] `model` is set only if override needed

**Body**
- [ ] Clear purpose statement
- [ ] Process steps are actionable
- [ ] Output format is specified
- [ ] No over-engineering

**Skills (if applicable)**
- [ ] Skill names in frontmatter match skill `name` fields
- [ ] Skills listed exist in .claude/skills/ or ~/.claude/skills/

**Security**
- [ ] Tools are minimally scoped
- [ ] No unnecessary write access for read-only tasks
- [ ] Bash patterns are specific, not wildcards

### Step 7: Present and Save

1. Show the complete AGENT.md
2. Display the completed checklist
3. Ask where to save:
   - Project: `.claude/agents/[agent-name].md` (default)
   - Personal: `~/.claude/agents/[agent-name].md`
4. Use Write tool to create the file
5. Remind user to restart Claude Code or run `/agents` to load

## Examples

### Example 1: Standalone Agent

**User**: "Create an agent for security code review"

**Result**:
```yaml
---
name: security-reviewer
description: Reviews code for security vulnerabilities. Use when auditing code, checking for OWASP issues, or reviewing authentication/authorization.
tools: Read, Grep, Glob, Bash(git diff:*)
model: sonnet
---

# Security Reviewer Agent

Expert security auditor focused on identifying vulnerabilities.

## Focus Areas
- OWASP Top 10 vulnerabilities
- Authentication and authorization flaws
- Input validation issues
- Injection vulnerabilities
- Sensitive data exposure

## Process
1. Read the target files or diff
2. Scan for security patterns and anti-patterns
3. Check for common vulnerabilities
4. Provide severity-rated findings

## Output Format
### Critical
- [Issue with file:line reference]

### High
- [Issue with file:line reference]

### Medium/Low
- [Issues]

### Summary
- Total issues: X
- Recommendation: [Approve / Block / Review]
```

### Example 2: Skill-Injected Agent

**User**: "Create an agent that uses my implement-ticket and qa-ticket skills"

**Result**:
```yaml
---
name: full-stack-agent
description: Handles both implementation and testing for tickets. Use when you need end-to-end ticket completion.
tools: Read, Write, Edit, Glob, Grep, Bash(git:*), Bash(npm test:*)
model: sonnet
skills:
  - implement-ticket
  - qa-ticket
---

# Full Stack Agent

Handles complete ticket lifecycle from implementation through testing.

## Process
1. Read the ticket requirements
2. Implement using injected implement-ticket skill patterns
3. Test using injected qa-ticket skill patterns
4. Report combined results

## Output Format
### Implementation
- Files changed: [list]
- Commits: [list]

### Testing
- Tests run: X
- Passed: Y
- Failed: Z

### Status
[Success / Partial / Failed]
```

Saved to: `.claude/agents/full-stack-agent.md`
