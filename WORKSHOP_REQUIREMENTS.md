# Workshop Requirements

Complete these setup steps **before** the workshop to ensure you're ready to participate without delays.

## Required Software

| Software | Minimum Version | Verification Command |
|----------|-----------------|---------------------|
| Python | 3.9+ | `python3 --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any recent | `git --version` |
| Claude Code | 2.1+ | `claude --version` |

## Setup Checklist

### 1. Python 3.9+

- **macOS**: `brew install python@3.12`
- **Windows**: Download from [python.org](https://www.python.org/downloads/) or `choco install python`
- **Linux**: `sudo apt install python3` (Ubuntu/Debian) or equivalent

### 2. Node.js 18+

- **All platforms**: Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **macOS**: `brew install node`
- **Windows**: `choco install nodejs-lts`

### 3. Git

- **macOS**: Pre-installed or `brew install git`
- **Windows**: Download from [git-scm.com](https://git-scm.com/)
- **Linux**: `sudo apt install git`

### 4. Claude Code 2.1+

Install Claude Code CLI:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify installation:

```bash
claude --version
# Should show 2.1.x or higher
```

If you have an older version, update with:

```bash
npm update -g @anthropic-ai/claude-code
```

### 5. JIRA Account Setup (Required)

You will need a JIRA account with API access for the workshop exercises.

#### Create a Free JIRA Account

1. Go to [https://www.atlassian.com/software/jira/free](https://www.atlassian.com/software/jira/free)
2. Click "Get it free" and create an account
3. Create a new project (any template works - Kanban recommended)
4. Note your JIRA instance URL (e.g., `https://your-name.atlassian.net`)

#### Generate an API Token

1. Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Workshop Token")
4. Copy and save the token securely - you won't be able to see it again

#### Information You'll Need During the Workshop

Have these ready:

- **JIRA Instance URL**: `https://your-name.atlassian.net`
- **Email**: The email you used to create the account
- **API Token**: The token you generated above
- **Project Key**: The short code for your project (e.g., "DEMO", "TEST")

## Optional (Recommended)

- **VS Code** with extensions:
  - Python
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
- **Playwright browsers** are installed automatically when running `npm install` at the project root

## Verify Your Setup

Run all verification commands:

```bash
python3 --version    # 3.9.x or higher
node --version       # v18.x or higher
npm --version        # 9.x or higher
git --version        # Any version
claude --version     # 2.1.x or higher
```

## Quick Test

Clone the repository and verify everything works:

```bash
git clone https://github.com/gravity9-tech/claude_code_workshop
cd claude_code_workshop
```

### Start the Application

```bash
./start.sh
```

This will:
1. Install Python dependencies (backend)
2. Install npm dependencies (frontend)
3. Start the backend on http://localhost:8765
4. Start the frontend on http://localhost:4321

Visit http://localhost:4321 - you should see the Tea Store application.

Press `Ctrl+C` to stop both services.

### Run Tests

```bash
# Using node directly (cross-platform)
node test.js              # Run backend + frontend unit tests
node test.js --e2e        # Include E2E tests (requires Playwright browsers)
node test.js --coverage   # Run with coverage reports

# Or using npm scripts
npm test                  # Run backend + frontend unit tests
npm run test:all          # Include E2E tests
npm run test:coverage     # Run with coverage reports
```

## Project Structure

```
tea-store-demo/
├── backend/           # Python FastAPI backend
├── frontend/          # React + TypeScript + Vite frontend
├── e2e/               # Playwright E2E tests
├── start.sh           # Start both services
└── test.js            # Cross-platform test runner
```

## Troubleshooting

### Python version issues
If `python3` points to an older version, you may need to use `python3.12` explicitly or update your PATH.

### Permission errors on npm global install
Use `sudo npm install -g` or configure npm to use a different directory for global packages.

### Port already in use
If ports 4321 or 8765 are in use, the scripts will try alternative ports or you can kill existing processes:
```bash
lsof -ti:4321 | xargs kill -9  # Kill process on port 4321
lsof -ti:8765 | xargs kill -9  # Kill process on port 8765
```

### Claude Code authentication
Run `claude` and follow the prompts to authenticate before the workshop.

### Playwright browser installation
Playwright browsers are installed automatically via `postinstall`. If E2E tests fail due to missing browsers, reinstall manually:
```bash
npx playwright install chromium
```

---

**Questions?** Contact the workshop organizer before the session.
