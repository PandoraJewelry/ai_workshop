"""Tests for discount API endpoints"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestDiscountAPI:
    def test_valid_percentage_discount(self):
        response = client.post(
            "/api/discount/validate",
            json={"code": "TEA10", "cart_total": 50.0},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
        assert data["discount_amount"] == 5.0  # 10% of 50

    def test_valid_fixed_discount(self):
        response = client.post(
            "/api/discount/validate",
            json={"code": "SAVE5", "cart_total": 30.0},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
        assert data["discount_amount"] == 5.0

    def test_invalid_discount_code(self):
        response = client.post(
            "/api/discount/validate",
            json={"code": "INVALID", "cart_total": 50.0},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is False

    def test_discount_below_minimum_order(self):
        response = client.post(
            "/api/discount/validate",
            json={"code": "TEA10", "cart_total": 10.0},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is False
        assert "Minimum order" in data["message"]

    def test_case_insensitive_code(self):
        response = client.post(
            "/api/discount/validate",
            json={"code": "tea10", "cart_total": 50.0},
        )
        assert response.status_code == 200
        assert response.json()["valid"] is True
