/**
 * Mock response engine for development and demo mode.
 * When the Devin API is not configured, this provides realistic
 * sample responses based on the actual Pandora codebase analysis.
 */

import type { FunctionCall, SourceReference, ViewMode } from "@/types";

type MockResponse = {
  answer: string;
  functionCalls: FunctionCall[];
  sources: SourceReference[];
};

const loyaltyResponsesCode: Record<string, MockResponse> = {
  default: {
    answer: `The Pandora loyalty program has three tiers: **Pink** (entry level), **Silver**, and **Gold**.

**Upgrade criteria for Silver:**
- Minimum **500 loyalty points**
- At least **3 purchases within the last 12 months**

Points are accumulated per purchase and tracked via the SFCC customer profile. The loyalty tier check happens during checkout via the \`checkoutHelpers.js\` module.

Key code references:
- \`checkoutHelpers.getLoyaltyTier(customerProfile)\` — determines current tier
- \`PandoraKnowledgeRetriever.cls\` — Salesforce backend for loyalty data
- \`PandoraProductRetriever_v7.cls\` — product scoring with loyalty weights

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

const loyaltyResponsesMarket: Record<string, MockResponse> = {
  birthday: {
    answer: `Here is the **complete end-to-end guide** to set up a **BirthdayDiscountGold** promotion in Business Manager:

---

### Step 1: Create the Customer Group (if not already existing)
1. Navigate to **Merchant Tools > Customers > Customer Groups**
2. Click **New Customer Group**
3. Set the ID to \`MyPandora-Gold\` (or use the existing Gold tier group)
4. Under **Definition**, set the rule to match customers in the Gold loyalty tier
5. Click **Apply**

---

### Step 2: Create the Campaign
1. Navigate to **Merchant Tools > Online Marketing > Campaigns**
2. Click **New Campaign**
3. Set the Campaign ID: \`BirthdayGold-2025\`
4. Set the **Start Date** and **End Date** (e.g., ongoing or yearly)
5. Check **Enabled**
6. Click **Apply**

---

### Step 3: Create the Promotion
1. Navigate to **Merchant Tools > Online Marketing > Promotions**
2. Click **New Promotion**
3. Fill in:
   - **Promotion ID**: \`BirthdayDiscountGold\`
   - **Name**: Birthday Discount - Gold Members
   - **Enabled**: Yes
   - **Promotion Class**: Product
   - **Assigned Campaign**: Select \`BirthdayGold-2025\`
4. Under the **Discounts** tab:
   - **Discount Type**: Percentage Off
   - **Discount Value**: Enter the percentage (e.g., 20%)
   - **Applies To**: Order / Product (depending on your requirement)
5. Under the **Qualifiers** tab:
   - **Customer Groups**: Add \`MyPandora-Gold\`
   - **Coupon**: Optionally create a coupon code like \`BDAY-GOLD-20\`
   - **Source Codes**: Optional
6. Under **Scheduling**:
   - Set to trigger during the customer's birthday month (this is typically handled via a customer attribute + coupon email flow)
7. Click **Apply**

---

### Step 4: Create an Associated Content Asset
1. Navigate to **Merchant Tools > Content > Content Assets**
2. Click **New Content Asset**
3. Fill in:
   - **Content Asset ID**: \`birthday-discount-gold-banner\`
   - **Name**: Birthday Gold Member Banner
   - **Online**: Yes
4. In the **Body** field, add the promotional message:
   - Example: "Happy Birthday! Enjoy 20% off as a Gold member"
5. Assign to the appropriate **folder** (e.g., \`promotions/birthday\`)
6. Click **Apply**

---

### Step 5: Configure the Promotion Banner in Amplience CMS
1. Log into **Amplience CMS**
2. Create a new **Promotion Module** content item
3. Set:
   - **Title**: "Happy Birthday, Gold Member!"
   - **Subtitle**: "Enjoy an exclusive 20% discount"
   - **CTA Button Text**: "Shop Now"
   - **CTA Link**: Link to relevant collection or homepage
   - **Legal Text**: "Valid during your birthday month. Gold members only."
4. **Schedule** it to display based on campaign dates
5. **Publish** the content

---

### Step 6: Test the Promotion
1. In Business Manager, go to **Merchant Tools > Online Marketing > Promotions**
2. Find \`BirthdayDiscountGold\` and verify it shows as **Enabled**
3. Use **Storefront Toolkit > Promotion Debugger** to test on the storefront
4. Add a product to cart as a Gold member and verify the discount applies

**Tip:** The birthday trigger is usually handled by an automated email (via SFMC or similar) that sends the coupon code to Gold members during their birthday month.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "birthday promotion setup Gold tier", domain: "loyalty" },
        result: "4 documents found",
        status: "success",
      },
      {
        name: "search_knowledge_base",
        args: { query: "promotion content asset setup", domain: "promotions" },
        result: "3 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
  default: {
    answer: `The Pandora loyalty program is called **My Pandora** and has three membership tiers:

**1. Pink (Entry Level)**
- Every customer starts here when they join My Pandora
- Basic benefits: birthday reward, member-only promotions

**2. Silver**
- Requires **500 loyalty points** and at least **3 purchases in the last 12 months**
- Additional benefits: early access to new collections, exclusive Silver-tier promotions

**3. Gold**
- Highest tier with premium benefits
- Exclusive VIP events and priority customer service

**How to manage loyalty in Business Manager:**

### Viewing Customer Tiers
1. Navigate to **Merchant Tools > Customers > Customer Groups**
2. Look for groups: \`MyPandora-Pink\`, \`MyPandora-Silver\`, \`MyPandora-Gold\`
3. Click on a group to see its members and rules

### Creating a Loyalty-Targeted Promotion
1. Go to **Merchant Tools > Online Marketing > Promotions**
2. Click **New Promotion**
3. Under **Qualifiers > Customer Groups**, select the loyalty tier you want to target
4. Set the discount type and value
5. Assign to a campaign with the appropriate schedule
6. Click **Apply** and enable the promotion

### Setting Up Loyalty Content
1. Create a content asset at **Merchant Tools > Content > Content Assets**
2. Use Amplience CMS for promotional banners targeting specific tiers
3. Schedule content to align with campaign dates

If a customer doesn't reach the next tier within their 12-month window, they keep their current tier and the window resets.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "loyalty tier business rules", domain: "loyalty" },
        result: "3 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
};

const promotionResponsesCode: Record<string, MockResponse> = {
  default: {
    answer: `The **Winter Sale** promotion logic works through SFCC's PromotionMgr system:

1. **Active promotions** are fetched via \`PromotionMgr.getActivePromotions()\` in the ActivePromotions controller
2. Promotions can be filtered by **customer group**, **coupon code**, or **source code**
3. The **price factory** (\`price.js\`) applies promotions in this order:
   - List price (from root price book)
   - Sale price (from sale price book)
   - **Promotion price** (calculated by \`priceHelper.getPromotionPrice()\`)
4. For EU markets, the **30-day lowest price rule** applies: if a product has been online 30+ days, the lowest price in that period is shown alongside the promo price

Key code references:
- \`ActivePromotions.js\` controller — retrieves and filters active promotions
- \`price.js\` factory — applies pricing waterfall (list > sale > promo)
- \`priceHelper.getPromotionPrice()\` — calculates final promotion price
- \`promotion-module-schema.json\` — CMS schema for promo banners

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

const promotionResponsesMarket: Record<string, MockResponse> = {
  birthday: {
    answer: `Here is the **complete end-to-end guide** to set up a **Birthday Discount** promotion in Business Manager:

---

### Step 1: Create a Campaign
1. Navigate to **Merchant Tools > Online Marketing > Campaigns**
2. Click **New Campaign**
3. Set Campaign ID: \`Birthday-Promotions-2025\`
4. Set it as **Enabled** with an ongoing schedule
5. Click **Apply**

---

### Step 2: Create the Promotion
1. Navigate to **Merchant Tools > Online Marketing > Promotions**
2. Click **New Promotion**
3. Fill in:
   - **Promotion ID**: \`BirthdayDiscountGold\` (or your desired name)
   - **Name**: Birthday Discount for Gold Members
   - **Enabled**: Yes
   - **Promotion Class**: Product or Order (based on requirement)
   - **Campaign**: Select \`Birthday-Promotions-2025\`
4. **Discounts** tab:
   - **Type**: Percentage Off
   - **Value**: 20% (or your desired discount)
5. **Qualifiers** tab:
   - **Customer Group**: Select \`MyPandora-Gold\`
   - **Coupon**: Create a new coupon \`BDAY-GOLD-20\` (or leave empty for automatic)
6. Click **Apply**

---

### Step 3: Create Coupon Codes (if using coupons)
1. Navigate to **Merchant Tools > Online Marketing > Coupons**
2. Click **New Coupon**
3. Set:
   - **Coupon ID**: \`BDAY-GOLD-20\`
   - **Type**: Single-use or Multiple-use per customer
   - **Redemption Limit**: 1 per customer
   - **Enabled**: Yes
4. Link to the promotion created above
5. Click **Apply**

---

### Step 4: Create the Content Asset
1. Navigate to **Merchant Tools > Content > Content Assets**
2. Click **New Content Asset**
3. Set:
   - **ID**: \`birthday-discount-gold-details\`
   - **Name**: Birthday Gold Discount Details
   - **Online**: Yes
4. In **Body**, write the terms and conditions
5. Assign to folder: \`promotions\`
6. Click **Apply**

---

### Step 5: Create Promotion Banner in Amplience
1. Open **Amplience CMS**
2. Create a new **Promotion Module**
3. Set title, subtitle, CTA, and legal text
4. Schedule for the campaign period
5. Publish

---

### Step 6: Verify
1. Go to **Merchant Tools > Online Marketing > Promotions** and check the promotion is **Enabled**
2. Use the **Storefront Toolkit > Promotion Debugger** to verify the discount applies
3. Test with a Gold-tier customer adding products to cart`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "birthday promotion setup steps", domain: "promotions" },
        result: "5 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
  default: {
    answer: `Here is the **complete end-to-end guide** to set up a promotion (e.g., Winter Sale) in Business Manager:

---

### Step 1: Create a Campaign
1. Navigate to **Merchant Tools > Online Marketing > Campaigns**
2. Click **New Campaign**
3. Set the Campaign ID (e.g., \`WinterSale-2025\`)
4. Set **Start Date** and **End Date**
5. Check **Enabled** and click **Apply**

---

### Step 2: Create the Promotion
1. Navigate to **Merchant Tools > Online Marketing > Promotions**
2. Click **New Promotion**
3. Fill in:
   - **Promotion ID**: e.g., \`WinterSale-20PercentOff\`
   - **Name**: Winter Sale - 20% Off
   - **Enabled**: Yes
   - **Promotion Class**: Product
   - **Campaign**: Select \`WinterSale-2025\`
4. **Discounts** tab:
   - Choose **Discount Type**: Percentage Off, Fixed Amount, or Buy-X-Get-Y
   - Set the **Discount Value** (e.g., 20%)
   - Set which products it applies to (all, specific categories, etc.)
5. **Qualifiers** tab:
   - **Customer Groups**: Select who can see the promotion (e.g., All Customers, Gold Members Only)
   - **Coupons**: Optionally link a coupon code
   - **Source Codes**: Optionally add tracking source codes
6. **Exclusions** tab: Exclude specific products or categories if needed
7. Click **Apply**

---

### Step 3: Create a Content Asset for the Promotion
1. Navigate to **Merchant Tools > Content > Content Assets**
2. Click **New Content Asset**
3. Set:
   - **ID**: e.g., \`winter-sale-terms\`
   - **Name**: Winter Sale Terms & Conditions
   - **Online**: Yes
4. Add promotion details and legal text in the **Body**
5. Assign to folder: \`promotions\`
6. Click **Apply**

---

### Step 4: Set Up Promotion Banner (Amplience CMS)
1. Open **Amplience CMS**
2. Create a new **Promotion Module** content item
3. Fill in: Title, Subtitle, CTA text, CTA link, Legal text
4. Set scheduling to match the campaign dates
5. Publish the content

---

### Step 5: Configure EU Pricing (if applicable)
- For **EU markets**, the **30-day lowest price** will automatically display alongside the promo price
- This is handled automatically by the system — no manual setup required
- The system tracks the lowest price over the past 30 days and shows it on the product page

---

### Step 6: Test & Verify
1. Go to **Merchant Tools > Online Marketing > Promotions** and verify status is **Enabled**
2. Open the **Storefront Toolkit** (on the storefront with the toolkit enabled)
3. Use the **Promotion Debugger** to confirm the discount applies correctly
4. Add products to cart and verify the promotional price is displayed

**Important:** Promotions are applied in **priority order**. If multiple promotions apply to the same product, the highest priority wins. Check the **Rank** column in the promotions list to adjust priority.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "promotion setup end to end", domain: "promotions" },
        result: "5 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
};

const contentResponsesCode: Record<string, MockResponse> = {
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

Key code references:
- Schema path: \`pandora-amplience-cms/contents/content-type-schema/schemas/\`
- i18n bundles: \`app_pandora_sfra_i18n/cartridge/templates/resources/\`
- PWA translations: \`pandora-ecom-web/apps/*/static/translations/\`

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

const contentResponsesMarket: Record<string, MockResponse> = {
  translation: {
    answer: `Here is the **complete guide** to managing translations in Business Manager and the CMS:

---

### Understanding Translation Systems
Pandora uses **two translation systems** depending on the storefront:

**1. SFCC Storefront (Business Manager)**
- Translations are stored as **.properties files** (key-value pairs)
- Over **30 locales** supported (en-GB, da-DK, de-DE, fr-FR, etc.)

**2. PWA Storefront (Amplience + JSON)**
- Translations are stored as **JSON files** per locale
- Managed through the build pipeline

---

### How to Update Translations in Business Manager
1. Navigate to **Merchant Tools > Content > Resource Bundles**
2. Select the **locale** you want to edit (e.g., da-DK for Danish)
3. Search for the **key** you want to change (e.g., \`checkout.button.placeorder\`)
4. Edit the **value** with the new translated text
5. Click **Save**

---

### How to Update CMS Content Translations (Amplience)
1. Open **Amplience CMS**
2. Select the content item you want to translate
3. Switch to the target **locale** using the locale selector
4. Enter the translated text for that locale
5. **Save** and **Publish**

---

### Adding a New Locale
This requires developer involvement — contact the development team to add a new locale configuration. The developer will need to:
- Add the locale to the site configuration
- Create the translation files
- Deploy the changes

**Tip:** Always test translations on the storefront after updating. Use the **locale switcher** on the site to verify.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "translation management process", domain: "content" },
        result: "6 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
  default: {
    answer: `Here is a guide to managing website content through **Amplience CMS** and **Business Manager**:

---

### Content Types Available in Amplience CMS

1. **Hero Banner** — The large banner at the top of pages
2. **Promotion Module** — Sale/campaign banners with legal text
3. **Product Slider** — Horizontal carousel of selected products
4. **Category Module** — Content blocks on category pages
5. **Gallery Module** — Image galleries for lookbook content
6. **Discover Module** — Editorial storytelling content

---

### How to Create a New Content Item (Amplience)
1. Log into **Amplience CMS**
2. Click **Create Content** and select the content type
3. Fill in the required fields (title, image, CTA, etc.)
4. Set the **locale** for each market's version
5. **Schedule** the publish date/time
6. Click **Save** then **Publish**

---

### How to Create a Content Asset (Business Manager)
1. Navigate to **Merchant Tools > Content > Content Assets**
2. Click **New Content Asset**
3. Set the **Content Asset ID** and **Name**
4. Set **Online**: Yes
5. Add content in the **Body** field
6. Assign to the correct **Folder**
7. Click **Apply**

---

### How to Assign Content to a Page Slot
1. Navigate to **Merchant Tools > Content > Page Designer**
2. Select the page you want to edit
3. Drag a content component into a slot
4. Configure the content or link to an existing content asset
5. **Save** and **Preview**

---

### Translations
- Over **30 locales** supported (en-GB, da-DK, de-DE, fr-FR, etc.)
- Each market sees content in their local language
- Update via **Resource Bundles** in BM or **locale switcher** in Amplience

**Tip:** Always preview content changes before publishing. Use the Amplience **Preview** button or BM's **Storefront Preview**.`,
    functionCalls: [
      {
        name: "search_knowledge_base",
        args: { query: "content management overview", domain: "content" },
        result: "8 documents found",
        status: "success",
      },
    ],
    sources: [],
  },
};

const responseMap: Record<ViewMode, Record<string, Record<string, MockResponse>>> = {
  code: {
    loyalty: loyaltyResponsesCode,
    promotions: promotionResponsesCode,
    content: contentResponsesCode,
  },
  market: {
    loyalty: loyaltyResponsesMarket,
    promotions: promotionResponsesMarket,
    content: contentResponsesMarket,
  },
};

export function getMockResponse(
  agentId: string,
  question: string,
  mode: ViewMode = "market"
): MockResponse {
  const modeResponses = responseMap[mode] || responseMap.market;
  const agentResponses = modeResponses[agentId] || modeResponses.content;

  // Simple keyword matching for demo purposes
  const lowerQuestion = question.toLowerCase();
  for (const [key, response] of Object.entries(agentResponses)) {
    if (key !== "default" && lowerQuestion.includes(key)) {
      return response;
    }
  }

  return agentResponses.default;
}
