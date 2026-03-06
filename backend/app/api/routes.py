from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.customization_config import (
    ProductCustomizationConfig,
    get_customization_config,
)
from app.mock_data import get_all_products, get_product_by_id, get_products_by_category
from app.models import Product

router = APIRouter()


@router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(
        None, description="Filter by category: black, green, oolong, herbal"
    ),
    price_max: Optional[int] = Query(
        None, description="Filter by max price"
    ),
    material: Optional[str] = Query(
        None, description="Filter by origin: China, Japan, India, Taiwan"
    ),
):
    """Get all products with optional filters"""
    products = get_all_products()

    if category:
        valid_categories = ["black", "green", "oolong", "herbal"]
        if category not in valid_categories:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}",
            )
        products = [p for p in products if p.category == category]

    if price_max:
        products = [p for p in products if p.price <= price_max]

    if material:
        valid_materials = ["China", "Japan", "India", "Taiwan"]
        if material not in valid_materials:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid origin. Must be one of: {', '.join(valid_materials)}",
            )
        products = [p for p in products if p.material == material]

    return products


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a specific product by ID"""
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/products/category/{category}", response_model=List[Product])
async def get_products_in_category(category: str):
    """Get all products in a specific category"""
    valid_categories = ["black", "green", "oolong", "herbal"]
    if category not in valid_categories:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}",
        )
    return get_products_by_category(category)


@router.get(
    "/customization-config/{category}", response_model=ProductCustomizationConfig
)
async def get_customization_configuration(category: str):
    """
    Get customization configuration for a product category

    Returns all available customization options with pricing for the specified category
    """
    valid_categories = ["black", "green", "oolong", "herbal"]
    if category not in valid_categories:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}",
        )

    config = get_customization_config(category)
    if not config:
        raise HTTPException(
            status_code=404,
            detail=f"Customization configuration not found for category: {category}",
        )

    return config
