---
name: create-jira-mcp
description: Sets up Jira MCP server integration for Claude Code. Use when setting up Jira, connecting to Atlassian, configuring MCP for ticket management, or adding Jira capabilities.
allowed-tools: Bash, Read, AskUserQuestion
---

# Create Jira MCP Integration

## Purpose

Guide users through setting up the Official Atlassian Rovo MCP server to enable Claude Code to interact with Jira and Confluence.

## Overview

This skill uses the **Official Atlassian Rovo MCP Server** which provides:
- OAuth 2.1 authentication (no API tokens to manage)
- Full Jira support including issue transitions
- Confluence integration
- Compass integration
- Always up-to-date with Atlassian Cloud

**Note**: This only works with Atlassian Cloud (*.atlassian.net). For self-hosted Jira Server/Data Center, a different setup is required.

## Available Tools After Setup

### Jira Tools
- `createJiraIssue` - Create issues
- `getJiraIssue` - Get issue details
- `editJiraIssue` - Modify issues
- `transitionJiraIssue` - Change issue status
- `getTransitionsForJiraIssue` - View available transitions
- `addCommentToJiraIssue` - Add comments
- `addWorklogToJiraIssue` - Add time tracking
- `searchJiraIssuesUsingJql` - JQL search
- `lookupJiraAccountId` - User lookup

### Confluence Tools
- Page creation and updates
- Content retrieval and search
- Comment management

## Instructions

### 1. Check Prerequisites

Run this command to verify Node.js v18+ is installed:
```bash
node --version
```

If Node.js is not installed or version is below 18, inform the user they need to install Node.js v18+ first.

### 2. Check Existing Configuration

Run this command to check if Atlassian MCP is already configured:
```bash
claude mcp list 2>/dev/null | grep -i atlassian
```

If the output shows "atlassian" is already configured, inform the user and skip to Step 4 (Display Notice).

### 3. Add the Official Atlassian MCP Server

**Run this command** to add the Official Atlassian Rovo MCP server:
```bash
claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse -s project
```

This registers the MCP server at project scope (creates `.mcp.json` in project root, can be committed for team sharing).

If the user specifically requests global/user scope, use this instead:
```bash
claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse -s user
```

### 4. Display Restart and Auth Notice

**IMPORTANT**: After completing setup, you MUST display this notice to the user:

```
================================================
  RESTART REQUIRED + OAUTH LOGIN
================================================
  The Atlassian MCP server has been configured.

  Next steps:
  1. Restart Claude Code
  2. On first use, a browser window will open
     for OAuth authentication with Atlassian
  3. Log in with your Atlassian account
  4. Grant the requested permissions

  After authentication:
  - Run /mcp to verify the server is connected
  - Test with: "List all Jira projects"
  - Try: "Transition PROJ-123 to Done"
================================================
```

## Output Format

Execute the setup commands directly using Bash tool. Do not just display commands for the user to copy - actually run them.

After running the setup, **always end with the restart/auth notice** - this is mandatory.

## Troubleshooting

**OAuth login fails:**
- Ensure you have access to the Atlassian Cloud site
- Try a different browser if the OAuth window doesn't open
- Check browser popup blockers

**Frequent re-authentication:**
- This is a known issue with the Rovo MCP server
- Re-run any command to trigger a new OAuth flow when needed

**MCP not connecting:**
- Restart Claude Code after adding the server
- Check `/mcp` shows the atlassian server
- Verify with: `claude mcp list`

**"Not supported" errors:**
- The Official Atlassian MCP only works with Atlassian Cloud
- Self-hosted Jira Server/Data Center requires a different MCP server

**Node.js issues:**
- Ensure Node.js v18+ is installed
- The MCP proxy requires Node.js to run locally

## Removing the Server

To remove the Atlassian MCP server:
```bash
claude mcp remove atlassian -s project
```

Or for user/global scope:
```bash
claude mcp remove atlassian -s user
```

## Example

**User**: "Set up Jira MCP for my project"

**Assistant actions**:
1. Run `node --version` to verify Node.js v18+ is installed
2. Run `claude mcp list` to check if Atlassian MCP is already configured
3. If not configured, run `claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse -s project`
4. Display the RESTART + OAUTH notice
5. Explain that a browser window will open on first use for authentication

The skill should execute the commands directly, not just display them for the user to copy.
