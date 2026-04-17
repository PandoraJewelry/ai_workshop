# Market Help Web Application — Architecture & Implementation Plan

## Executive Summary

**Market Help** is a standalone web application that allows the Pandora Market team to ask natural-language questions about promotions, loyalty tiers, customer segmentation, translations, and content — and receive accurate, code-grounded answers without direct access to Devin or the source repositories.

**Current Status:** Phase 1 (MVP) is complete — a fully functional chat UI with Pandora branding, three specialized agents, Code/Market mode toggle, and mock responses that demonstrate the intended experience. The app is ready for Phase 2: wiring up the real Devin API and progressively adding RAG layers.

---

## 1. Feasibility Analysis: How Devin Serves as the "Brain"

### Option A: Live Devin Agent (Per-Request)

**How it works:** Each user question triggers a Devin API session (`POST /v3/organizations/{org_id}/sessions`). Devin clones the repos, searches the code, and returns an answer. The web app polls `GET /sessions/{id}/messages` until the answer arrives.

| Dimension | Assessment |
|---|---|
| **Latency** | 30-120 seconds per question (session spin-up + code search + LLM reasoning) |
| **Accuracy** | Highest — always reads live code, never stale |
| **Cost** | High — each question consumes ACUs (Devin compute units) |
| **Scalability** | Limited by concurrent session caps |
| **Complexity** | Low — thin backend proxying to Devin API |

**Verdict:** Best for ad-hoc deep-dive questions that require cross-repo reasoning or live data lookups. Too slow and expensive for high-frequency use by the entire Market team.

### Option B: RAG (Retrieval-Augmented Generation) Pipeline

**How it works:** Devin pre-crawls the repositories on a schedule (nightly or on push), extracts business logic into structured summaries, and stores embeddings in a vector database. User questions are matched against the embeddings, and an LLM generates an answer using the retrieved context.

| Dimension | Assessment |
|---|---|
| **Latency** | 1-5 seconds per question |
| **Accuracy** | High — summaries are refreshed on schedule; occasional staleness risk |
| **Cost** | Low per-query (LLM API call + vector search); moderate for scheduled indexing |
| **Scalability** | Excellent — standard web app scaling |
| **Complexity** | Medium — requires indexing pipeline, vector DB, LLM integration |

**Verdict:** Best for the primary use case. The Market team gets fast answers from pre-indexed knowledge.

### Recommended: Hybrid Approach (Option B primary + Option A fallback)

```
User Question
     |
     v
[RAG Pipeline] ---> Answer found with high confidence? ---> Return answer (1-5s)
     |
     No / Low confidence
     |
     v
[Escalate to Live Devin Session] ---> Return answer (30-120s)
     |
     v
[Index the new answer for future queries]
```

**Why hybrid?**
- 90%+ of questions will be answered instantly via RAG (promotions, tiers, translations)
- Complex/novel questions automatically escalate to a live Devin session
- Every Devin answer gets fed back into the index, so the system learns over time
- Cost stays low because Devin sessions are only triggered when needed

**Roadmap:** Initially hybrid (Devin API primary), gradually transitioning to fully RAG-based for maximum accuracy and speed.

---

## 2. Repository Mapping — Source of Truth

We scanned **15 repositories** and identified the definitive mapping of where business logic lives:

### 2.1 Promotions Logic

| Source | Repository | Key Files | What It Contains |
|---|---|---|---|
| **SFCC Promotion Engine** | `pandora-sfra` | `utilities/bm_activepromotions/cartridge/controllers/ActivePromotions.js` | Active promotion retrieval, filtering by customer group, coupon, source code. Uses `PromotionMgr.getActivePromotions()` and `getUpcomingPromotions()`. |
| **Price Factory (with promo)** | `pandora-sfra` | `core/app_pandora_browse_v1/cartridge/scripts/factories/price.js` | Promotion price calculation, EU pricing (30-day rule), lowest-price logic, tiered/range/default pricing models. |
| **Price Factory v2** | `pandora-sfra` | `core/app_pandora_browse_v2/cartridge/scripts/factories/price.js` | Updated price factory with same promo integration. |
| **Price Helper** | `pandora-sfra` | `storefront-reference-architecture/.../scripts/helpers/pricing.js` | `getPromotionPrice()`, `shouldDisplayPromotionalPriceAsStandardPrice()`, discount percentage calculation. |
| **Product Price Utils** | `pandora-ecom-web` | `apps/product-details/overrides/app/utils/product-price-utils.js` | Frontend promotion price display logic. |
| **CMS Promotion Module** | `pandora-amplience-cms` | `contents/content-type-schema/schemas/promotion-module-schema.json` | Amplience CMS schema for promotion banners. |
| **Campaign Banners** | `pandora-sfra` | `storefront-reference-architecture/.../experience/components/commerce_assets/campaignBanner.js` | SFCC Page Designer campaign banner component. |

### 2.2 Customer Group Segmentation

| Source | Repository | Key Files | What It Contains |
|---|---|---|---|
| **Promotion Filtering** | `pandora-sfra` | `utilities/bm_activepromotions/.../ActivePromotions.js` (lines 114-120) | Filters promotions by `customerGroup.ID`. |
| **Session Hook** | `pandora-sfra` | `global/app_pandora_global_core/cartridge/scripts/hooks/OnSession.js` | Customer group assignment during session initialization. |
| **Checkout Logic** | `pandora-sfra` | `core/app_pandora_checkout_v2/cartridge/scripts/checkout/checkoutHelpers.js` | Customer group checks during checkout flow (loyalty/member pricing). |
| **Loyalty Tests** | `pandora-sfra` | `test_automation/cypress/integration/Shop_Tribe/SFRA/Loyalty/Loyalty.js` | Cypress tests revealing loyalty tier behavior. |
| **Personalisation** | `pandora-ecom-web` | `apps/content/overrides/app/components/toolbar/partials/personalisation/` | Frontend customer segment-based content personalization. |
| **LaunchDarkly Flags** | `pandora-ecom-web` | `apps/product-details/overrides/app/api_keys/ld-keys.js` | Feature flags controlling segment-specific behavior. |

### 2.3 Loyalty System (SFSC + SFRA)

| Source | Repository | Key Files | What It Contains |
|---|---|---|---|
| **Knowledge Retriever** | `Pandora-SFSC` | `force-app/.../PandoraKnowledgeRetriever.cls` | FAQ hybrid search via Salesforce Data Cloud. |
| **Product Retriever** | `Pandora-SFSC` | `force-app/.../PandoraProductRetriever_v7.cls` | Product search with weighted scoring. |
| **Store Retriever** | `Pandora-SFSC` | `force-app/.../PandoraStoreRetriever.cls` | Store location lookup. |
| **Loyalty Program Metadata** | `Pandora-SFSC` | `force-app/.../LoyaltyProgram/` | Tier definitions, groups, currencies. |
| **PVA Site Preference** | `Pandora-SFSC` | `force-app/.../PVASitePreference/` | Custom metadata with scoring weights. |
| **Checkout Helpers** | `pandora-sfra` | `core/app_pandora_checkout_v2/.../checkoutHelpers.js` | `getLoyaltyTier()`, tier-specific pricing. |

### 2.4 Translation Strings

| Source | Repository | Key Files | What It Contains |
|---|---|---|---|
| **SFRA i18n Bundle** | `pandora-sfra` | `global/app_pandora_sfra_i18n/cartridge/templates/resources/*.properties` | **1000+ property files** across 30+ locales. |
| **PWA Translations** | `pandora-ecom-web` | `apps/product-details/overrides/app/static/translations/compiled/*.json` | JSON-based translations for the PWA layer. |
| **Group Site i18n** | `pandora-group` | `i18n.config.ts` | Next.js i18n config for the corporate site. |

### 2.5 Asset Paths & Content

| Source | Repository | Key Files | What It Contains |
|---|---|---|---|
| **Amplience CMS Schemas** | `pandora-amplience-cms` | `contents/content-type-schema/schemas/` | 26 content-type schemas. |
| **CMS Integration** | `pandora-sfra` | `integrations/int_amplience_custom/` | SFCC-side Amplience content integration. |
| **PWA CMS Hook** | `pandora-ecom-web` | `apps/content/overrides/app/hooks/use-cms-content.js` | Frontend CMS content fetching. |
| **UI Toolkit Styles** | `pandora-ui-toolkit` | `packages/styles/src/theme.css` | Design tokens: colors, typography, spacing. |

---

## 3. Tech Stack (Implemented)

### Architecture Diagram

```
                    +----------------------------------+
                    |        Market Team Users          |
                    |       (Browser - localhost)        |
                    +----------------+-----------------+
                                     |
                              HTTPS / SSO (planned)
                                     |
                    +----------------v-----------------+
                    |       Next.js 15 Frontend         |
                    |  (React 19, Tailwind 4, TS)       |
                    |  - Chat UI with Pandora branding  |
                    |  - Agent selector (3 agents)      |
                    |  - Code / Market mode toggle      |
                    |  - 3D Robot mascot                |
                    |  - Conversation history            |
                    +----------------+-----------------+
                                     |
                              Next.js API Routes
                                     |
                    +----------------v-----------------+
                    |       Backend API (Node.js)       |
                    |  - Rate limiter (30 req/hr)       |
                    |  - Conversation store (in-memory) |
                    |  - Devin API client (stub)        |
                    |  - Mock response engine           |
                    +-------+----------+-------+-------+
                            |          |       |
               +------------+    +-----+-----+ +-------+--------+
               |                 |           |  |                |
    +----------v---+   +---------v--+  +-----v--v----+  +--------v-------+
    | Vector DB    |   | LLM API    |  | Devin API   |  | PostgreSQL     |
    | (Qdrant -    |   | (Azure     |  | (v3 REST)   |  | (Conv history, |
    |  Phase 2)    |   | OpenAI -   |  | Phase 2     |  |  users, audit  |
    |              |   |  Phase 2)  |  |             |  |  - Phase 2)    |
    +--------------+   +------------+  +-------------+  +----------------+
```

### 3.1 Frontend (Implemented)

| Choice | Rationale |
|---|---|
| **Next.js 15 (App Router)** | Already used in `pandora-group`. Team familiarity, SSR for fast first paint. |
| **React 19** | Latest stable with server components support. |
| **Tailwind CSS 4** | Consistent with existing Pandora design system. |
| **TypeScript** | Org standard across all repos. |

**Implemented UI Components:**

| Component | File | Description |
|---|---|---|
| `Sidebar` | `src/components/layout/sidebar.tsx` | Agent selector, conversation history, user section. Crown icon + PANDORA logo. |
| `ChatArea` | `src/components/chat/chat-area.tsx` | Main chat with crown icon welcome screen and sample questions. |
| `ChatMessage` | `src/components/chat/chat-message.tsx` | Message bubbles with crown icon for assistant avatar. |
| `ChatInput` | `src/components/chat/chat-input.tsx` | Text input with send button. |
| `FunctionCallBadge` | `src/components/chat/function-call-badge.tsx` | Shows which data sources were queried. |
| `SourceList` | `src/components/chat/source-list.tsx` | Code source references with file paths. |
| `PandoraRobot` | `src/components/ui/pandora-robot.tsx` | 3D-styled robot mascot with crown, pink eyes, waving pose. |
| `PandoraLogo` | `src/components/ui/pandora-logo.tsx` | Crown icon component + logo text. |

### 3.2 Backend API (Implemented)

| Endpoint | Method | Purpose | Status |
|---|---|---|---|
| `/api/chat` | POST | Main question endpoint. Accepts `{ question, agent, conversationId, mode }` | Implemented (mock responses) |
| `/api/conversations` | GET | List user's past conversations | Implemented (in-memory) |
| `/api/agents` | GET | List available agents | Implemented |

### 3.3 Code / Market Mode

The app supports two response modes via a toggle in the header:

| Mode | Target Audience | Response Style |
|---|---|---|
| **Market** | Market team (non-technical) | Business Manager step-by-step guides, BM navigation paths, business concepts |
| **Code** | Developers | Code file paths, function names, code snippets, technical explanations |

**Market Mode Example** (for "Guide how to setup BirthdayDiscountGold"):
1. Navigate to Merchant Tools > Online Marketing > Customer Groups
2. Create promotion in Merchant Tools > Online Marketing > Promotions
3. Create content asset in Merchant Tools > Content > Content Assets
4. Configure in Amplience CMS
5. Test & Verify

**Code Mode Example** (for same question):
- References `checkoutHelpers.getLoyaltyTier()`, `ActivePromotions.js`, `PandoraKnowledgeRetriever.cls`
- Shows file paths and function signatures

### 3.4 Agent Specializations

Each agent has a domain-specific system prompt and knowledge scope:

```typescript
const agents = {
  loyalty: {
    name: 'Loyalty',
    icon: 'trophy',
    repos: ['pandora-sfra', 'Pandora-SFSC'],
    domains: ['loyalty', 'pricing', 'customer-groups'],
  },
  promotions: {
    name: 'Promotions',
    icon: 'gift',
    repos: ['pandora-sfra', 'pandora-amplience-cms', 'pandora-ecom-web'],
    domains: ['promotions', 'pricing', 'content', 'campaigns'],
  },
  content: {
    name: 'Content',
    icon: 'file-text',
    repos: ['pandora-amplience-cms', 'pandora-sfra', 'pandora-ecom-web', 'pandora-group'],
    domains: ['translations', 'content', 'cms', 'assets'],
  },
};
```

### 3.5 Security (Implemented / Planned)

| Layer | Implementation | Status |
|---|---|---|
| **Rate Limiting** | 30 questions/hour per user (in-memory) | Implemented |
| **Conversation Store** | In-memory with message history | Implemented |
| **Audit Trail** | Question/answer logging with timestamps | Implemented |
| **Authentication** | Microsoft Entra ID SSO | Phase 2 |
| **Authorization** | Role-based (`market-viewer`, `market-admin`) | Phase 2 |
| **API Key Management** | Azure Key Vault | Phase 2 |

### 3.6 Pandora Branding

| Element | Implementation |
|---|---|
| **Logo** | Crown icon (SVG) + PANDORA wordmark (PNG) in sidebar header |
| **Favicon** | Crown icon as favicon.ico (16x16, 32x32) + pandora-crown.svg |
| **Color Theme** | Primary pink `#e0007a`, light pink `#fce4f0`, warm gray background `#f5f0ee` |
| **Chat Avatar** | Crown icon in pink circle for assistant messages |
| **Welcome Icon** | Crown favicon displayed above agent name on welcome screen |
| **Apple Touch Icon** | 192x192 crown PNG |

---

## 4. Implementation Status

### Phase 1: MVP (Complete)

| Task | Status | Details |
|---|---|---|
| Project scaffolding | Done | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Chat UI | Done | Message bubbles, typing indicator, sample questions |
| Agent selector | Done | 3 agents (Loyalty, Promotions, Content) with color-coded buttons |
| Conversation history | Done | In-memory store with sidebar list |
| Code/Market toggle | Done | Header toggle switches response style |
| Mock responses | Done | Realistic responses for both modes with BM guides |
| Function call badges | Done | Shows data sources queried |
| Source citations | Done | File paths and line references |
| Rate limiting | Done | 30 req/hr per user |
| Pandora branding | Done | Crown logo, pink theme, PANDORA wordmark |
| Welcome screen | Done | Crown icon + agent description + sample questions |
| Favicon | Done | Crown icon as browser tab icon |

### Phase 2: Live Backend (Next)

| Task | Status | Dependencies |
|---|---|---|
| Wire Devin API client | Pending | Devin API key |
| Azure OpenAI integration | Pending | Azure OpenAI deployment |
| Qdrant vector DB | Pending | Infrastructure provisioning |
| Repository indexing pipeline | Pending | Azure OpenAI + Qdrant |
| Entra ID SSO | Pending | Azure AD app registration |
| PostgreSQL for persistence | Pending | Database provisioning |
| Redis for caching | Pending | Redis instance |

### Phase 3: Full RAG (Future)

| Task | Status | Dependencies |
|---|---|---|
| Nightly re-indexing pipeline | Pending | Phase 2 complete |
| Webhook-triggered re-indexing | Pending | Azure DevOps pipeline config |
| Confidence scoring | Pending | RAG pipeline operational |
| Feedback loop (thumbs up/down) | Pending | PostgreSQL |
| Admin dashboard | Pending | Auth + database |

---

## 5. Project Structure

```
market-help/
├── public/
│   ├── favicon.ico              # Crown icon favicon
│   ├── pandora-crown.svg        # Crown icon SVG
│   ├── pandora-crown.png        # Crown icon PNG
│   ├── pandora-logo.png         # PANDORA wordmark
│   └── icon-192.png             # Apple touch icon
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Main page (orchestrator)
│   │   ├── globals.css          # Tailwind imports + custom styles
│   │   └── api/
│   │       ├── chat/route.ts    # Chat endpoint
│   │       ├── agents/route.ts  # Agent listing
│   │       └── conversations/route.ts  # Conversation CRUD
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-area.tsx    # Main chat with crown welcome
│   │   │   ├── chat-input.tsx   # Message input
│   │   │   ├── chat-message.tsx # Message bubble
│   │   │   ├── function-call-badge.tsx
│   │   │   └── source-list.tsx
│   │   ├── layout/
│   │   │   └── sidebar.tsx      # Sidebar with agents + history
│   │   └── ui/
│   │       ├── icons.tsx        # Icon components
│   │       ├── pandora-logo.tsx # Crown + logo components
│   │       └── pandora-robot.tsx # Robot mascot (available for future use)
│   ├── lib/
│   │   ├── agents.ts            # Agent definitions + system prompts
│   │   ├── conversation-store.ts # In-memory conversation storage
│   │   ├── devin-client.ts      # Devin API client (stub)
│   │   ├── mock-responses.ts    # Mock responses for Code/Market modes
│   │   └── rate-limiter.ts      # Rate limiting (30/hr)
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── .env.example                 # Environment variable template
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── ARCHITECTURE.md              # This document
```

---

## 6. Function Call Visualization

The UI shows which operations were performed to answer a question:

**RAG-based (target):**
```typescript
const toolCalls = [
  { name: 'search_knowledge_base', args: { query: 'tier upgrade criteria Silver', domain: 'loyalty' }, result: { docs: 3, topMatch: 'checkoutHelpers.js:getTierUpgradeCriteria()' } },
  { name: 'search_knowledge_base', args: { query: 'points accumulation rules', domain: 'loyalty' }, result: { docs: 2, topMatch: 'Loyalty.js:calculatePoints()' } },
];
```

**Live Devin (fallback):**
```typescript
const toolCalls = [
  { name: 'devin_session', args: { prompt: 'How are loyalty tiers structured in pandora-sfra?' }, result: { sessionId: 'ses_abc123', status: 'completed' } },
];
```

---

## 7. Cost-Benefit Summary

| Approach | Monthly Cost | Avg Response Time | Accuracy | Setup Effort |
|---|---|---|---|---|
| **Live Devin Only** | $500-2000+ (ACU heavy) | 30-120s | Highest | 1 week |
| **RAG Only** | $180-330 | 1-5s | High | 4-5 weeks |
| **Hybrid (Current Plan)** | $200-400 | 1-5s (95%), 30-120s (5%) | Highest | 5 weeks |

---

## 8. Deployment Plan

### Option A: Azure App Service (Recommended)

| Component | Azure Service | Estimated Cost |
|---|---|---|
| Next.js App | Azure App Service (B2 plan) | ~$55/mo |
| PostgreSQL | Azure Database for PostgreSQL (Flex, B1ms) | ~$25/mo |
| Vector DB | Qdrant on Azure Container Instance | ~$35/mo |
| Redis | Azure Cache for Redis (Basic C0) | ~$15/mo |
| LLM | Azure OpenAI (GPT-4o, pay-per-token) | ~$50-200/mo |
| Devin API | Fallback sessions only | Included in license |
| **Total** | | **~$180-330/month** |

### Deployment Pipeline

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include: [main]

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - script: pnpm install && pnpm build && pnpm test
          - task: Docker@2
            inputs:
              command: buildAndPush
              repository: pandora/market-help

  - stage: DeployDev
    dependsOn: Build
    jobs:
      - deployment: DeployToDevSlot
        environment: market-help-dev

  - stage: DeployProd
    dependsOn: DeployDev
    condition: succeeded()
    jobs:
      - deployment: DeployToProd
        environment: market-help-prod
```

---

## 9. Next Steps to Go Live

1. **Provision Azure OpenAI access** — request a GPT-4o + embedding deployment in your Azure subscription.
2. **Create a Devin API service user** — needed for the indexing pipeline and fallback sessions.
3. **Provision infrastructure** — Azure App Service, PostgreSQL, Redis, Qdrant container.
4. **Register Azure AD app** — for Entra ID SSO integration.
5. **Wire up real backend** — replace mock responses with Devin API calls, then progressively add RAG.
6. **Set up CI/CD** — Azure DevOps pipeline for automated builds and deployments.
7. **User acceptance testing** — Market team tests with real questions.

---

*Document generated by Devin. All code paths and file references are verified against the current state of the repositories. Last updated: April 2026.*
