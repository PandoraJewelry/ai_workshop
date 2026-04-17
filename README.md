# Market Help

A web application for the Pandora Market team to ask natural-language questions about business logic (promotions, loyalty, translations, content) and receive code-grounded answers.

## Architecture

**Hybrid approach**: RAG primary (low latency) with Devin API fallback (for complex questions).

```
Market Team → Next.js Frontend → API Routes → Mock/Devin API → Answer
                                      ↓
                              (Future: RAG Pipeline → Vector DB → LLM)
```

### Agents

| Agent | Domain | Key Repos |
|-------|--------|-----------|
| **Loyalty** | Tiers, points, customer segments | pandora-sfra, Pandora-SFSC |
| **Promotions** | Discounts, campaigns, pricing | pandora-sfra, pandora-amplience-cms |
| **Content** | CMS, translations, assets | pandora-amplience-cms, pandora-ecom-web |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

- `DEVIN_API_KEY` — Optional. Falls back to curated mock responses if not set.
- `DEVIN_ORG_ID` — Required with API key for live Devin sessions.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **AI Brain**: Devin API (Phase 1) → RAG + Azure OpenAI (Phase 2)
- **Auth**: Microsoft Entra ID SSO (planned)

## Project Structure

```
src/
  app/
    api/
      chat/           # POST /api/chat — Main question endpoint
      conversations/  # GET /api/conversations — History
      agents/         # GET /api/agents — Available agents
    page.tsx          # Main chat interface
    layout.tsx        # Root layout
    globals.css       # Tailwind + custom styles
  components/
    chat/             # Chat UI components
    layout/           # Sidebar, header
    ui/               # Icons, shared UI
  lib/
    agents.ts         # Agent definitions + system prompts
    devin-client.ts   # Devin REST API client
    mock-responses.ts # Curated demo responses
    conversation-store.ts  # In-memory store (→ PostgreSQL)
    rate-limiter.ts   # Rate limiting (→ Redis)
  types/
    index.ts          # TypeScript type definitions
```

## Roadmap

- [x] Phase 1: Chat UI + Mock Responses + Devin API integration
- [ ] Phase 2: RAG pipeline (Qdrant + Azure OpenAI embeddings)
- [ ] Phase 3: Entra ID SSO + PostgreSQL persistence
- [ ] Phase 4: Nightly repo crawling + knowledge refresh
