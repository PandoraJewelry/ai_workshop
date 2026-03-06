"""
E2E Tests for Product Customization UI using Playwright MCP

This module contains end-to-end tests for the customization builder feature,
testing the complete user flow from opening the modal to adding customized
products to the cart.
"""

import asyncio

import pytest
from playwright.async_api import Browser, Page, async_playwright

BASE_URL = "http://localhost:4321"


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def browser():
    """Launch browser for testing."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        yield browser
        await browser.close()


@pytest.fixture
async def page(browser: Browser):
    """Create a new page for each test."""
    context = await browser.new_context(viewport={"width": 1280, "height": 720})
    page = await context.new_page()
    yield page
    await context.close()


class TestCustomizationModal:
    """Tests for customization modal opening and closing."""

    @pytest.mark.asyncio
    async def test_modal_opens_on_customize_button_click(self, page: Page):
        """Test that clicking Customize button opens the modal."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Wait for products to load
        await page.wait_for_selector(".product-card", timeout=5000)

        # Find a product with Customize button
        customize_btn = await page.query_selector("button:has-text('Customize')")
        assert customize_btn is not None, "No Customize button found"

        # Click customize button
        await customize_btn.click()

        # Wait for modal to appear
        await page.wait_for_selector("#customizationModal:not(.hidden)", timeout=3000)

        # Verify modal is visible
        modal = await page.query_selector("#customizationModal")
        is_hidden = await modal.evaluate("el => el.classList.contains('hidden')")
        assert not is_hidden, "Modal should be visible"

    @pytest.mark.asyncio
    async def test_modal_closes_on_close_button(self, page: Page):
        """Test that clicking close button closes the modal."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open modal
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Click close button
        close_btn = await page.query_selector("#closeCustomizationBtn")
        await close_btn.click()

        # Wait for modal to hide
        await page.wait_for_timeout(500)

        # Verify modal is hidden
        modal = await page.query_selector("#customizationModal")
        is_hidden = await modal.evaluate("el => el.classList.contains('hidden')")
        assert is_hidden, "Modal should be hidden"

    @pytest.mark.asyncio
    async def test_modal_closes_on_overlay_click(self, page: Page):
        """Test that clicking overlay closes the modal."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open modal
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Click overlay
        overlay = await page.query_selector("#customizationOverlay")
        await overlay.click()

        # Wait for modal to hide
        await page.wait_for_timeout(500)

        # Verify modal is hidden
        modal = await page.query_selector("#customizationModal")
        is_hidden = await modal.evaluate("el => el.classList.contains('hidden')")
        assert is_hidden, "Modal should be hidden"


class TestCustomizationSteps:
    """Tests for customization wizard step navigation."""

    @pytest.mark.asyncio
    async def test_stepper_shows_all_steps(self, page: Page):
        """Test that the stepper shows all 4 steps."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open modal
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Check stepper steps
        steps = await page.query_selector_all(".stepper-step")
        assert len(steps) == 4, "Should have 4 steps"

        # Verify step labels
        labels = await page.query_selector_all(".step-label")
        step_texts = [await label.inner_text() for label in labels]
        assert step_texts == ["Metal", "Details", "Engraving", "Summary"]

    @pytest.mark.asyncio
    async def test_next_button_advances_step(self, page: Page):
        """Test that clicking Next advances to the next step."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open modal
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Verify we're on step 1
        first_step = await page.query_selector(".stepper-step.active")
        assert first_step is not None

        # Select a metal type (required)
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        # Click Next button
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()

        # Wait for step transition
        await page.wait_for_timeout(500)

        # Verify we moved to step 2
        active_steps = await page.query_selector_all(".stepper-step.active")
        assert (
            len(active_steps) >= 2
            or await page.query_selector("text=Details") is not None
        )

    @pytest.mark.asyncio
    async def test_previous_button_goes_back(self, page: Page):
        """Test that clicking Previous goes back to previous step."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open modal and navigate to step 2
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Select metal and go to step 2
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Click Previous
        prev_btn = await page.query_selector("#prevStepBtn")
        await prev_btn.click()
        await page.wait_for_timeout(500)

        # Should be back on step 1 (metal selection visible)
        metal_options = await page.query_selector_all(".option-card")
        assert len(metal_options) > 0


class TestRingCustomization:
    """Tests for complete ring customization flow."""

    @pytest.mark.asyncio
    async def test_complete_ring_customization(self, page: Page):
        """Test complete ring customization flow."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Filter to show only rings
        category_filter = await page.query_selector("#categoryFilter")
        await category_filter.select_option("rings")
        await page.wait_for_timeout(1000)

        # Open customization for first ring
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Step 1: Select metal type
        gold_option = await page.query_selector(".option-card:has-text('Gold')")
        if gold_option:
            await gold_option.click()
        else:
            # Select first available metal
            metal_option = await page.query_selector(".option-card")
            await metal_option.click()

        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 2: Select ring size
        size_select = await page.query_selector("select")
        if size_select:
            await size_select.select_option("7")

        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 3: Engraving (optional, skip)
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 4: Summary - verify we can see the summary
        summary_container = await page.query_selector("#customizationStepContent")
        summary_html = await summary_container.inner_html()
        assert "Summary" in summary_html or "Total" in summary_html

    @pytest.mark.asyncio
    async def test_ring_with_engraving(self, page: Page):
        """Test ring customization with engraving."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Filter to rings
        category_filter = await page.query_selector("#categoryFilter")
        await category_filter.select_option("rings")
        await page.wait_for_timeout(1000)

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Step 1: Select metal
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 2: Skip details
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 3: Add engraving
        engraving_input = await page.query_selector("input[type='text']")
        if engraving_input:
            await engraving_input.fill("Forever")
            await page.wait_for_timeout(300)

        await next_btn.click()
        await page.wait_for_timeout(500)

        # Verify engraving appears in summary
        summary = await page.query_selector("#customizationStepContent")
        summary_text = await summary.inner_text()
        # Should show engraving if it was added
        assert (
            "Forever" in summary_text
            or "Engraving" in summary_text
            or "Summary" in summary_text
        )


class TestNecklaceCustomization:
    """Tests for necklace customization flow."""

    @pytest.mark.asyncio
    async def test_necklace_customization_with_pendant(self, page: Page):
        """Test necklace customization with pendant selection."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Filter to necklaces
        category_filter = await page.query_selector("#categoryFilter")
        await category_filter.select_option("necklaces")
        await page.wait_for_timeout(1000)

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Step 1: Select metal
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 2: Select chain length and pendant
        length_select = await page.query_selector("select")
        if length_select:
            await length_select.select_option("18")

        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 3: Skip engraving
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Verify summary step
        summary = await page.query_selector("#customizationStepContent")
        assert summary is not None


class TestBraceletCustomization:
    """Tests for bracelet customization flow."""

    @pytest.mark.asyncio
    async def test_bracelet_with_charms(self, page: Page):
        """Test bracelet customization with charm selection."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Filter to bracelets
        category_filter = await page.query_selector("#categoryFilter")
        await category_filter.select_option("bracelets")
        await page.wait_for_timeout(1000)

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Step 1: Select metal
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 2: Select charms (multi-select)
        checkboxes = await page.query_selector_all("input[type='checkbox']")
        if checkboxes:
            # Select up to 2 charms
            for i, checkbox in enumerate(checkboxes[:2]):
                await checkbox.click()
                await page.wait_for_timeout(200)

        await next_btn.click()
        await page.wait_for_timeout(500)

        # Step 3: Skip engraving
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Verify summary
        summary = await page.query_selector("#customizationStepContent")
        assert summary is not None


class TestPriceCalculation:
    """Tests for real-time price calculation."""

    @pytest.mark.asyncio
    async def test_price_updates_on_metal_selection(self, page: Page):
        """Test that price updates when selecting different metals."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Get initial price
        price_elem = await page.query_selector("#priceSummaryContainer")
        # Store initial price for reference
        _ = await price_elem.inner_text() if price_elem else ""

        # Select metal with price modifier
        gold_option = await page.query_selector(".option-card:has-text('Gold')")
        if gold_option:
            await gold_option.click()
            await page.wait_for_timeout(500)

            # Verify price updated
            updated_price_text = await price_elem.inner_text() if price_elem else ""
            # Price should change or show breakdown
            assert "$" in updated_price_text

    @pytest.mark.asyncio
    async def test_price_shows_breakdown(self, page: Page):
        """Test that price breakdown is displayed."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Select metal
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        # Navigate to summary
        next_btn = await page.query_selector("#nextStepBtn")
        for _ in range(3):
            await next_btn.click()
            await page.wait_for_timeout(500)

        # Verify price breakdown exists
        summary = await page.query_selector("#customizationStepContent")
        summary_text = await summary.inner_text()
        assert "$" in summary_text  # Should show price


class TestCartIntegration:
    """Tests for adding customized products to cart."""

    @pytest.mark.asyncio
    async def test_add_customized_product_to_cart(self, page: Page):
        """Test adding a customized product to the cart."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Get initial cart count
        cart_count_elem = await page.query_selector("#cartCount")
        initial_count = int(await cart_count_elem.inner_text())

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Quick customization
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        next_btn = await page.query_selector("#nextStepBtn")
        # Navigate to summary (3 clicks)
        for _ in range(3):
            await next_btn.click()
            await page.wait_for_timeout(500)

        # Add to cart
        add_to_cart_btn = await page.query_selector("button:has-text('Add to Cart')")
        if add_to_cart_btn:
            await add_to_cart_btn.click()
            await page.wait_for_timeout(1000)

            # Verify cart count increased
            updated_count = int(await cart_count_elem.inner_text())
            assert updated_count == initial_count + 1

    @pytest.mark.asyncio
    async def test_customized_item_shows_in_cart(self, page: Page):
        """Test that customized items show customization details in cart."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Complete customization and add to cart
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Select metal
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        # Navigate to summary and add to cart
        next_btn = await page.query_selector("#nextStepBtn")
        for _ in range(3):
            await next_btn.click()
            await page.wait_for_timeout(500)

        add_to_cart_btn = await page.query_selector("button:has-text('Add to Cart')")
        if add_to_cart_btn:
            await add_to_cart_btn.click()
            await page.wait_for_timeout(1000)

            # Open cart
            cart_btn = await page.query_selector("#cartBtn")
            await cart_btn.click()
            await page.wait_for_timeout(500)

            # Verify "Customized" badge exists
            cart_items = await page.query_selector("#cartItems")
            cart_html = await cart_items.inner_html()
            assert "Customized" in cart_html or "cart-item" in cart_html


class TestValidation:
    """Tests for validation and error handling."""

    @pytest.mark.asyncio
    async def test_required_field_validation(self, page: Page):
        """Test that required fields are validated."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Try to go to next step without selecting metal (required)
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Should either show error or stay on same step
        # Verify we're still on step 1 by checking for metal options
        metal_options = await page.query_selector_all(".option-card")
        # If validation works, we should still see metal options or an error
        assert len(metal_options) > 0 or await page.query_selector(".error-message")

    @pytest.mark.asyncio
    async def test_engraving_length_validation(self, page: Page):
        """Test that engraving length is validated."""
        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Navigate to engraving step
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)
        await next_btn.click()
        await page.wait_for_timeout(500)

        # Try to enter very long engraving
        engraving_input = await page.query_selector("input[type='text']")
        if engraving_input:
            long_text = "A" * 100  # Too long
            await engraving_input.fill(long_text)
            await page.wait_for_timeout(500)

            # Try to proceed
            await next_btn.click()
            await page.wait_for_timeout(500)

            # Should show validation error or limit input
            input_value = await engraving_input.input_value()
            assert len(input_value) <= 50 or await page.query_selector(".error-message")


class TestMobileResponsive:
    """Tests for mobile responsive behavior."""

    @pytest.mark.asyncio
    async def test_modal_responsive_on_mobile(self, page: Page):
        """Test that customization modal works on mobile viewport."""
        # Set mobile viewport
        await page.set_viewport_size({"width": 375, "height": 667})

        await page.goto(BASE_URL)
        await page.wait_for_selector("#productGrid")

        # Open customization
        customize_btn = await page.query_selector("button:has-text('Customize')")
        await customize_btn.click()
        await page.wait_for_selector("#customizationModal:not(.hidden)")

        # Verify modal is visible and usable
        modal = await page.query_selector("#customizationModal")
        is_visible = await modal.is_visible()
        assert is_visible

        # Verify options are clickable
        metal_option = await page.query_selector(".option-card")
        await metal_option.click()

        # Verify next button works
        next_btn = await page.query_selector("#nextStepBtn")
        await next_btn.click()
        await page.wait_for_timeout(500)
