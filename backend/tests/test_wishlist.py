"""
Backend API tests for Wishlist functionality

These tests verify the backend API endpoints that support wishlist features.
The wishlist itself is client-side (localStorage), but it depends on product data from the API.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestWishlistIntegration:
    """Integration tests for wishlist feature with backend API"""

    def test_products_api_available_for_wishlist(self):
        """Test that products API is available for wishlist to fetch product data"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert len(products) > 0

        # Verify product structure contains fields needed by wishlist
        first_product = products[0]
        required_fields = ["id", "name", "price", "category", "material", "image", "description"]
        for field in required_fields:
            assert field in first_product

    def test_wishlist_can_fetch_specific_products(self):
        """Test that wishlist can fetch specific product details by ID"""
        # First get all products to find valid IDs
        response = client.get("/api/products")
        products = response.json()
        product_id = products[0]["id"]

        # Test fetching specific product
        response = client.get(f"/api/products/{product_id}")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == product_id
        assert all(field in product for field in ["name", "price", "image", "description"])

    def test_products_have_valid_images(self):
        """Test that products have image URLs for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        for product in products:
            assert "image" in product
            assert isinstance(product["image"], str)
            assert len(product["image"]) > 0

    def test_products_have_all_display_fields(self):
        """Test that products have all fields needed for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        display_fields = ["id", "name", "price", "category", "material", "description", "image"]

        for product in products:
            for field in display_fields:
                assert field in product, f"Product {product.get('id')} missing {field}"
                assert product[field] is not None, f"Product {product.get('id')} has null {field}"

    def test_products_api_filters_work_for_wishlist(self):
        """Test that product filtering works (useful for wishlist search/filter features)"""
        # Test category filter
        response = client.get("/api/products?category=green")
        assert response.status_code == 200
        products = response.json()
        assert all(p["category"] == "green" for p in products)

        # Test origin filter
        response = client.get("/api/products?material=Japan")
        assert response.status_code == 200
        products = response.json()
        assert all(p["material"] == "Japan" for p in products)

    def test_wishlist_can_handle_all_product_categories(self):
        """Test that all product categories can be added to wishlist"""
        categories = ["black", "green", "oolong", "herbal"]

        for category in categories:
            response = client.get(f"/api/products?category={category}")
            assert response.status_code == 200
            products = response.json()
            assert len(products) > 0, f"No products found for category: {category}"

            # Verify first product has all required fields
            first_product = products[0]
            assert first_product["category"] == category
            assert all(field in first_product for field in ["id", "name", "price", "image"])

    def test_products_price_format_for_wishlist(self):
        """Test that product prices are correctly formatted for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        for product in products:
            assert isinstance(product["price"], (int, float))
            assert product["price"] > 0
            # Price should be a reasonable value for tea
            assert 0 < product["price"] < 1000
