---
name: command-creator
description: Creates well-structured Claude Code slash commands from descriptions. Use when the user wants to create a new command, build an orchestrator, or make a workflow command that chains skills or agents.
allowed-tools: WebSearch, WebFetch, Write, Read, Glob
---

# Command Creator

Create well-structured Claude Code slash commands (orchestrators) from natural language descriptions.

## Purpose

Generate slash command files that orchestrate workflows by chaining skills, spawning subagents, or executing multi-step processes.

## When to Use

- User wants to create a slash command (not a skill)
- User needs an orchestrator that coordinates multiple skills
- User wants a command that spawns subagents for parallel work
- User needs a workflow command with explicit user invocation

## Instructions

When the user describes a command they want to create, follow these steps:

### Step 1: Understand the Request

Parse the user's description to identify:
- What workflow the command should orchestrate
- What skills or agents it should coordinate
- What arguments it needs from the user
- Whether it should run sequentially or spawn parallel subagents

### Step 2: Research Best Practices

Use WebSearch to find:
- Best practices for Claude Code slash commands
- Patterns for the command's domain (e.g., deployment, testing)
- Orchestration patterns if coordinating multiple skills/agents

Summarize 2-3 key insights that should inform the command design.

### Step 3: Design the Command Metadata

**Filename**: Lowercase, hyphenated, action-oriented (becomes the `/command-name`)

**Frontmatter Fields**:

| Field | Purpose | Example |
|-------|---------|---------|
| `description` | Shown in `/help`, explains what command does | `"Deploy ticket through full dev lifecycle"` |
| `allowed-tools` | Tools the command can use without prompting | `Bash(git:*), Read, Edit` |
| `argument-hint` | Shows expected arguments in autocomplete | `[ticket-key] [--skip-qa]` |
| `model` | Override model (sonnet, haiku, opus) | `sonnet` |
| `disable-model-invocation` | Set `true` to prevent auto-invocation | `true` (recommended for orchestrators) |

**Derive Required Tools**:
| Command Needs | Tools |
|---------------|-------|
| Read files | Read, Glob, Grep |
| Modify files | Read, Edit, Write |
| Run shell commands | Bash, Bash(git:*), Bash(npm:*) |
| Use skills | (skills auto-load, no tool needed) |
| Spawn subagents | Task |
| Web research | WebSearch, WebFetch |

### Step 4: Design Orchestration Pattern

Choose the appropriate pattern:

**Sequential Skill Orchestration**:
```markdown
## Workflow

Execute these phases in order:

1. **Phase 1: [Name]**
   - Use the [skill-name] skill to [action]
   - Capture: [what to capture for next phase]

2. **Phase 2: [Name]**
   - Use the [skill-name] skill to [action]
   - Pass: [data from previous phase]
```

**Parallel Subagent Orchestration**:
```markdown
## Workflow

Launch these subagents in parallel using the Task tool:

1. **Research Agent** (subagent_type: Explore)
   - Task: [research task]

2. **Analysis Agent** (subagent_type: general-purpose)
   - Task: [analysis task]

After all complete, synthesize results into [output].
```

**Conditional Workflow**:
```markdown
## Workflow

1. Check: [condition]
2. If [condition A]: Execute [workflow A]
3. If [condition B]: Execute [workflow B]
4. Always: [final step]
```

### Step 5: Write the Command File

Use this structure:

```markdown
---
description: [Brief description for /help]
allowed-tools: [Only necessary tools]
argument-hint: [Expected arguments]
disable-model-invocation: true
---

# [Command Title]

[One-sentence purpose]

## Arguments

- `$ARGUMENTS` - [What the full argument string represents]
- `$1` - [First positional argument] (if applicable)
- `$2` - [Second positional argument] (if applicable)

## Workflow

[Numbered steps describing the orchestration]

1. **Phase Name**
   - Action to take
   - What to capture/report

2. **Phase Name**
   - Action to take
   - What to pass forward

## Error Handling

- If [error condition]: [recovery action]
- If [phase fails]: [how to resume]

## Output

Report a summary including:
- [Key metric 1]
- [Key metric 2]
- [Status/result]
```

### Step 6: Validate with Checklist

Before presenting, verify ALL items:

**Frontmatter**
- [ ] `description` is clear and under 100 characters
- [ ] `allowed-tools` includes only necessary tools
- [ ] `argument-hint` shows expected input format
- [ ] `disable-model-invocation: true` for user-invoked orchestrators

**Body**
- [ ] Purpose is clear in one sentence
- [ ] Arguments are documented with `$ARGUMENTS`, `$1`, `$2` as needed
- [ ] Workflow steps are numbered and actionable
- [ ] Each step identifies which skill/agent to use
- [ ] Error handling includes recovery paths
- [ ] Output format is specified

**Orchestration**
- [ ] Skills are referenced by exact name
- [ ] Subagent types are specified if using Task tool
- [ ] Data flow between phases is clear
- [ ] Sequential vs parallel execution is explicit

### Step 7: Present and Save

1. Show the complete command file
2. Display the completed checklist
3. Ask where to save (default: `.claude/commands/[command-name].md`)
4. Use Write tool to create the file

## Example

**User**: "Create a command that orchestrates my four dev lifecycle skills into a single deploy workflow"

**Result**:

```markdown
---
description: Orchestrate full dev lifecycle from feature to tested code
allowed-tools: Read, Edit, Write, Bash(git:*)
argument-hint: [feature-description or TICKET-KEY] [--skip-qa] [--dry-run]
disable-model-invocation: true
---

# Deploy Ticket

Orchestrate the complete development lifecycle from idea to tested, committed code.

## Arguments

- `$ARGUMENTS` - Feature description OR existing ticket key
- `--skip-qa` - Skip the QA testing phase
- `--dry-run` - Only create and expand ticket, no implementation

## Workflow

1. **CREATE PHASE**
   - If $ARGUMENTS looks like a ticket key (e.g., PROJECT-123), skip to phase 2
   - Otherwise, use the create-ticket skill to create a Jira ticket
   - Capture: ticket key

2. **EXPAND PHASE**
   - Use the expand-ticket skill on the ticket
   - Capture: DEV subtask count, QA subtask count

3. **IMPLEMENT PHASE** (skip if --dry-run)
   - Use the implement-ticket skill on the ticket
   - Report progress as each DEV subtask completes

4. **QA PHASE** (skip if --dry-run or --skip-qa)
   - Use the qa-ticket skill on the ticket
   - Report test results

5. **SUMMARY**
   - Report: ticket key, subtasks completed, files changed, test status

## Error Handling

- If any phase fails: Stop and report which phase failed
- Include error details and affected subtask
- Suggest resume command: "Run /deploy-ticket TICKET-KEY to retry"

## Output

Final summary:
- Ticket: [KEY] - [URL]
- Subtasks: X DEV completed, Y QA completed
- Files changed: [count]
- Status: Success / Partial / Failed
```

Saved to: `.claude/commands/deploy-ticket.md`
