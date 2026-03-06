"""
Tests for customization API endpoints
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestCustomizationAPI:
    """Test customization endpoints"""

    def test_get_customization_config_black(self):
        """Test getting customization options for black tea"""
        response = client.get("/api/customization-config/black")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "black"
        assert len(config["options"]) > 0

        # Check package_size option exists
        package_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "package_size"), None
        )
        assert package_option is not None
        assert package_option["required"] is True
        assert len(package_option["values"]) == 4  # 50g, 100g, 250g, 500g

    def test_get_customization_config_green(self):
        """Test getting customization options for green tea"""
        response = client.get("/api/customization-config/green")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "green"

        # Check leaf_style option exists
        leaf_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "leaf_style"),
            None,
        )
        assert leaf_option is not None
        assert len(leaf_option["values"]) == 3  # Loose Leaf, Pyramid Sachets, Stone-Ground Powder

    def test_get_customization_config_oolong(self):
        """Test getting customization options for oolong tea"""
        response = client.get("/api/customization-config/oolong")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "oolong"

        # Check roast_level option exists
        roast_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "roast_level"), None
        )
        assert roast_option is not None
        assert len(roast_option["values"]) == 3  # Light, Medium, Dark

    def test_get_customization_config_invalid_category(self):
        """Test error when category is invalid"""
        response = client.get("/api/customization-config/invalid")
        assert response.status_code == 400
        error = response.json()
        assert "Invalid category" in error["detail"]

    def test_price_modifiers_present(self):
        """Test that all options have price modifiers"""
        response = client.get("/api/customization-config/black")
        config = response.json()

        for option in config["options"]:
            if option["values"]:  # If option has values
                for value in option["values"]:
                    assert "price_modifier" in value
                    assert isinstance(value["price_modifier"], (int, float))

    def test_gift_note_validation_rules(self):
        """Test that gift note options have validation rules"""
        categories = ["black", "green", "oolong", "herbal"]

        for category in categories:
            response = client.get(f"/api/customization-config/{category}")
            config = response.json()

            gift_note_option = next(
                (opt for opt in config["options"] if opt["option_id"] == "gift_note"),
                None,
            )
            assert gift_note_option is not None
            assert gift_note_option["option_type"] == "text"
            assert "validation_rules" in gift_note_option
            assert gift_note_option["validation_rules"]["max_length"] == 100


class TestCustomizableProducts:
    """Test that products have customizable flag"""

    def test_product_has_customizable_field(self):
        """Test that products include customizable field"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()

        # All products should have customizable field
        for product in products:
            assert "customizable" in product
            assert isinstance(product["customizable"], bool)

    def test_some_products_are_customizable(self):
        """Test that at least some products are marked as customizable"""
        response = client.get("/api/products")
        products = response.json()

        customizable_products = [p for p in products if p.get("customizable", False)]
        assert len(customizable_products) >= 6  # We marked 6 products as customizable

    def test_customizable_products_per_category(self):
        """Test that at least one category has customizable products"""
        categories = ["black", "green", "oolong", "herbal"]

        total_customizable = 0
        for category in categories:
            response = client.get(f"/api/products?category={category}")
            products = response.json()

            customizable_count = sum(
                1 for p in products if p.get("customizable", False)
            )
            total_customizable += customizable_count

        assert total_customizable >= 6, "Should have at least 6 customizable products total"

    def test_specific_customizable_products(self):
        """Test that specific products are marked as customizable"""
        customizable_ids = [1, 2, 6, 7, 10, 11]  # IDs we marked as customizable

        for product_id in customizable_ids:
            response = client.get(f"/api/products/{product_id}")
            assert response.status_code == 200
            product = response.json()
            assert (
                product["customizable"] is True
            ), f"Product {product_id} should be customizable"
