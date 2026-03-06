from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestProductAPI:
    """Test cases for Product API endpoints"""

    def test_get_all_products(self):
        """Test GET /api/products returns all products"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) == 15  # We have 15 mock products
        assert all("id" in p and "name" in p and "price" in p for p in products)

    def test_get_product_by_id(self):
        """Test GET /api/products/{id} returns specific product"""
        response = client.get("/api/products/1")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == 1
        assert "name" in product
        assert "price" in product
        assert "category" in product
        assert "image" in product
        assert "description" in product

    def test_get_nonexistent_product(self):
        """Test GET /api/products/{id} with invalid id returns 404"""
        response = client.get("/api/products/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Product not found"

    def test_get_products_by_category_black(self):
        """Test GET /api/products/category/black"""
        response = client.get("/api/products/category/black")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "black" for p in products)
        assert len(products) > 0

    def test_get_products_by_category_green(self):
        """Test GET /api/products/category/green"""
        response = client.get("/api/products/category/green")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "green" for p in products)
        assert len(products) > 0

    def test_get_products_by_category_oolong(self):
        """Test GET /api/products/category/oolong"""
        response = client.get("/api/products/category/oolong")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "oolong" for p in products)
        assert len(products) > 0

    def test_get_products_invalid_category(self):
        """Test GET /api/products/category/{category} with invalid category"""
        response = client.get("/api/products/category/invalid")
        assert response.status_code == 400
        assert "Invalid category" in response.json()["detail"]

    def test_product_schema(self):
        """Test that product response matches expected schema"""
        response = client.get("/api/products/1")
        product = response.json()

        # Check all required fields exist
        required_fields = [
            "id",
            "name",
            "price",
            "category",
            "material",
            "image",
            "description",
        ]
        for field in required_fields:
            assert field in product

        # Check data types
        assert isinstance(product["id"], int)
        assert isinstance(product["name"], str)
        assert isinstance(product["price"], (int, float))
        assert isinstance(product["category"], str)
        assert isinstance(product["material"], str)
        assert isinstance(product["image"], str)
        assert isinstance(product["description"], str)

        # Check category is valid
        assert product["category"] in ["black", "green", "oolong", "herbal"]

        assert product["material"] in ["China", "Japan", "India", "Taiwan"]

        # Check price is positive
        assert product["price"] > 0

    def test_category_distribution(self):
        """Test that we have products in all categories"""
        response = client.get("/api/products")
        products = response.json()

        categories = set(p["category"] for p in products)
        assert "black" in categories
        assert "green" in categories
        assert "oolong" in categories
        assert "herbal" in categories

    def test_material_distribution(self):
        """Test that we have products from all origins"""
        response = client.get("/api/products")
        products = response.json()

        materials = set(p["material"] for p in products)
        assert "China" in materials
        assert "Japan" in materials
        assert "India" in materials
        assert "Taiwan" in materials

    def test_filter_by_category(self):
        """Test filtering products by category"""
        response = client.get("/api/products?category=green")
        assert response.status_code == 200
        products = response.json()
        assert all(p["category"] == "green" for p in products)
        assert len(products) > 0

    def test_filter_by_price(self):
        """Test filtering products by max price"""
        response = client.get("/api/products?price_max=50")
        assert response.status_code == 200
        products = response.json()
        assert all(p["price"] <= 50 for p in products)
        assert len(products) > 0

    def test_filter_by_material(self):
        """Test filtering products by origin"""
        response = client.get("/api/products?material=Japan")
        assert response.status_code == 200
        products = response.json()
        assert all(p["material"] == "Japan" for p in products)
        assert len(products) > 0

    def test_filter_multi_parameter(self):
        """Test filtering with multiple parameters"""
        response = client.get(
            "/api/products?category=green&price_max=100&material=Japan"
        )
        assert response.status_code == 200
        products = response.json()
        assert all(
            p["category"] == "green" and p["price"] <= 100 and p["material"] == "Japan"
            for p in products
        )

    def test_filter_invalid_category(self):
        """Test filtering with invalid category returns 400"""
        response = client.get("/api/products?category=invalid")
        assert response.status_code == 400
        assert "Invalid category" in response.json()["detail"]

    def test_filter_invalid_material(self):
        """Test filtering with invalid origin returns 400"""
        response = client.get("/api/products?material=France")
        assert response.status_code == 400
        assert "Invalid origin" in response.json()["detail"]

    def test_filter_no_results(self):
        """Test filtering that returns no results"""
        response = client.get("/api/products?category=herbal&material=Japan")
        assert response.status_code == 200
        products = response.json()
        assert products == []
