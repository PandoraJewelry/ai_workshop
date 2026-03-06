import pytest
from pydantic import ValidationError

from app.models import Product


class TestProductModel:
    """Test cases for Product model"""

    def test_valid_product(self):
        """Test creating a valid product"""
        product = Product(
            id=1,
            name="Dragon Well Green Tea",
            price=42.00,
            category="green",
            material="China",
            image="https://example.com/tea.jpg",
            description="Premium hand-picked Longjing tea",
        )
        assert product.id == 1
        assert product.name == "Dragon Well Green Tea"
        assert product.price == 42.00
        assert product.category == "green"
        assert product.material == "China"

    def test_invalid_category(self):
        """Test that invalid category raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=100.0,
                category="invalid_category",
                material="China",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_negative_price(self):
        """Test that negative price raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=-100.0,
                category="green",
                material="China",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_zero_price(self):
        """Test that zero price raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=0,
                category="green",
                material="China",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_empty_name(self):
        """Test that empty name raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="",
                price=100.0,
                category="green",
                material="China",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_empty_description(self):
        """Test that empty description raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Test Product",
                price=100.0,
                category="green",
                material="China",
                image="https://example.com/image.jpg",
                description="",
            )

    def test_all_valid_categories(self):
        """Test all valid categories"""
        valid_categories = ["black", "green", "oolong", "herbal"]
        for category in valid_categories:
            product = Product(
                id=1,
                name="Test Product",
                price=100.0,
                category=category,
                material="China",
                image="https://example.com/image.jpg",
                description="Test description",
            )
            assert product.category == category

    def test_all_valid_materials(self):
        """Test all valid origins"""
        valid_materials = ["China", "Japan", "India", "Taiwan"]
        for material in valid_materials:
            product = Product(
                id=1,
                name="Test Product",
                price=100.0,
                category="green",
                material=material,
                image="https://example.com/image.jpg",
                description="Test description",
            )
            assert product.material == material

    def test_invalid_material(self):
        """Test that invalid origin raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=100.0,
                category="green",
                material="France",
                image="https://example.com/image.jpg",
                description="Test description",
            )
