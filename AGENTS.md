# AGENTS.md

## Setup Commands
- Run `./start.sh` (macOS/Linux) or `start.bat` (Windows) to start both services
- Backend: `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
- Frontend: `cd frontend && npm install`
- E2E deps: `npm install` from project root
- Backend runs on port 8765, frontend on port 4321

## Code Style
- Frontend: TypeScript with React 19, ESLint 9 flat config
- Backend: Python 3.12 with FastAPI and Pydantic models
- Use Tailwind CSS 4 for styling (utility-first)
- Run `npm run lint` in `frontend/` to check lint errors
- Follow existing patterns in `components/features/` and `components/shared/`

## Testing Guidelines
- Run all tests: `node test.js` or `npm test`
- Run with E2E: `node test.js --e2e`
- Run with coverage: `node test.js --coverage`
- Backend tests: `cd backend && pytest -v`
- Frontend unit tests: `cd frontend && npm run test`
- E2E tests: `npx playwright test`
- On Linux, install Playwright deps: `npx playwright install-deps chromium`

## Project Structure
- `backend/` — FastAPI Python API (`app/routes.py`, `app/models.py`, `app/mock_data.py`)
- `frontend/` — React + Vite app (`src/components/`, `src/contexts/`, `src/services/`, `src/types/`)
- `e2e/` — Playwright end-to-end tests
- `test.js` — Cross-platform test runner script
- `start.sh` / `start.bat` — Quick-start scripts

## Development Workflow
- Frontend proxies `/api` requests to backend during dev
- State (cart, wishlist, theme) persists via localStorage
- Use React Context providers for shared state management
- API docs available at `http://localhost:8765/docs` when backend is running
