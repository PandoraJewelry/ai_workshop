/**
 * Mock response engine for development and demo mode.
 * When the Devin API is not configured, this provides realistic
 * sample responses based on the actual Pandora codebase analysis.
 */

import type { FunctionCall, SourceReference } from "@/types";

type MockResponse = {
  answer: string;
  functionCalls: FunctionCall[];
  sources: SourceReference[];
};

const loyaltyResponses: Record<string, MockResponse> = {
  default: {
    answer: `The Pandora loyalty program has three tiers: **Pink** (entry level), **Silver**, and **Gold**.

**Upgrade criteria for Silver:**
- Minimum **500 loyalty points**
- At least **3 purchases within the last 12 months**

Points are accumulated per purchase and tracked via the SFCC customer profile. The loyalty tier check happens during checkout via the \`checkoutHelpers.js\` module.

If a customer doesn't meet the upgrade criteria by their tier anniversary date, they remain on their current tier but their annual window resets.`,
    functionCalls: [
      {
        name: "get_tier_upgrade_criteria",
        args: { tier: "Silver" },
        result: '{ minPoints: 500, minOrders: 3, window: "12mo" }',
        status: "success",
      },
      {
        name: "search_knowledge_base",
        args: { query: "loyalty tier upgrade rules", domain: "loyalty" },
        result: "3 documents found",
        status: "success",
      },
    ],
    sources: [
      {
        repo: "pandora-sfra",
        filePath: "core/app_pandora_checkout_v2/cartridge/scripts/checkout/checkoutHelpers.js",
        summary: "Loyalty tier check during checkout flow",
      },
      {
        repo: "Pandora-SFSC",
        filePath: "force-app/main/default/classes/PandoraKnowledgeRetriever.cls",
        summary: "Salesforce loyalty data retrieval",
      },
    ],
  },
};

const promotionResponses: Record<string, MockResponse> = {
  default: {
    answer: `The **Winter Sale** promotion logic works through SFCC's PromotionMgr system:

1. **Active promotions** are fetched via \`PromotionMgr.getActivePromotions()\` in the ActivePromotions controller
2. Promotions can be filtered by **customer group**, **coupon code**, or **source code**
3. The **price factory** (\`price.js\`) applies promotions in this order:
   - List price (from root price book)
   - Sale price (from sale price book)
   - **Promotion price** (calculated by \`priceHelper.getPromotionPrice()\`)
4. For EU markets, the **30-day lowest price rule** applies: if a product has been online 30+ days, the lowest price in that period is shown alongside the promo price

Promotion banners are managed via **Amplience CMS** using the \`promotion-module\` content type, which includes title, subtitle, CTA, legal text, and Monetate A/B test variations.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "promotion calculation logic", domain: "promotions" },
        result: "5 documents found",
        status: "success",
      },
      {
        name: "search_knowledge_base",
        args: { query: "EU pricing lowest price rule", domain: "pricing" },
        result: "2 documents found",
        status: "success",
      },
    ],
    sources: [
      {
        repo: "pandora-sfra",
        filePath: "utilities/bm_activepromotions/cartridge/controllers/ActivePromotions.js",
        summary: "Active promotion retrieval and filtering",
      },
      {
        repo: "pandora-sfra",
        filePath: "core/app_pandora_browse_v1/cartridge/scripts/factories/price.js",
        summary: "Price factory with promotion price application and EU pricing",
      },
      {
        repo: "pandora-amplience-cms",
        filePath: "contents/content-type-schema/schemas/promotion-module-schema.json",
        summary: "CMS schema for promotion banners",
      },
    ],
  },
};

const contentResponses: Record<string, MockResponse> = {
  default: {
    answer: `Pandora manages content through **Amplience CMS** with 26 content-type schemas:

**Key content types:**
- \`hero-banner\` — Full-width hero images with title/CTA
- \`promotion-module\` — Sale/promotion banners with legal text and Monetate A/B variations
- \`product-slider-module\` — Horizontal product carousels
- \`category-module\` — Category landing page content
- \`gallery-module\` — Image galleries
- \`discover-module\` — Editorial discovery content

**Translations** are managed in two systems:
- **SFCC**: 1000+ \`.properties\` files in \`app_pandora_sfra_i18n\` covering 30+ locales
- **PWA**: JSON files in \`pandora-ecom-web/apps/*/static/translations/\` (compiled + merged per locale)

All content types support **localized strings** via Amplience's localization schema, allowing different text per market.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "Amplience content types", domain: "content" },
        result: "8 documents found",
        status: "success",
      },
      {
        name: "search_knowledge_base",
        args: { query: "translation string locations", domain: "translations" },
        result: "4 documents found",
        status: "success",
      },
    ],
    sources: [
      {
        repo: "pandora-amplience-cms",
        filePath: "contents/content-type-schema/schemas/",
        summary: "26 Amplience content type schemas",
      },
      {
        repo: "pandora-sfra",
        filePath: "global/app_pandora_sfra_i18n/cartridge/templates/resources/",
        summary: "SFCC i18n resource bundles (30+ locales)",
      },
      {
        repo: "pandora-ecom-web",
        filePath: "apps/product-details/overrides/app/static/translations/",
        summary: "PWA JSON translations",
      },
    ],
  },
};

const responseMap: Record<string, Record<string, MockResponse>> = {
  loyalty: loyaltyResponses,
  promotions: promotionResponses,
  content: contentResponses,
};

export function getMockResponse(
  agentId: string,
  question: string
): MockResponse {
  const agentResponses = responseMap[agentId] || contentResponses;

  // Simple keyword matching for demo purposes
  const lowerQuestion = question.toLowerCase();
  for (const [key, response] of Object.entries(agentResponses)) {
    if (key !== "default" && lowerQuestion.includes(key)) {
      return response;
    }
  }

  return agentResponses.default;
}
