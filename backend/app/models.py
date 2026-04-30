from typing import Literal

from pydantic import BaseModel, Field


class Product(BaseModel):
    """Tea product model"""

    id: int = Field(..., description="Unique product identifier")
    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., gt=0, description="Product price in USD")
    category: Literal["black", "green", "oolong", "herbal"] = Field(
        ..., description="Product category"
    )
    material: Literal["China", "Japan", "India", "Taiwan"] = Field(
        ..., description="Tea origin"
    )
    image: str = Field(..., description="Product image URL")
    description: str = Field(..., min_length=1, description="Product description")
    customizable: bool = Field(
        False, description="Whether product supports customization"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Dragon Well Green Tea",
                "price": 34.99,
                "category": "green",
                "image": "/static/images/tea/green1.jpg",
                "description": "Premium hand-picked Longjing tea from Hangzhou",
            }
        }


class DiscountCode(BaseModel):
    """Discount code model"""

    code: str = Field(..., description="Discount code string")
    discount_type: Literal["percentage", "fixed"] = Field(
        ..., description="Type of discount"
    )
    value: float = Field(
        ..., gt=0, description="Discount value (percentage or fixed USD amount)"
    )
    min_order: float = Field(
        0.0, ge=0, description="Minimum cart total required to apply discount"
    )
    active: bool = Field(
        True, description="Whether the discount code is currently active"
    )


class DiscountValidationRequest(BaseModel):
    code: str
    cart_total: float


class DiscountValidationResponse(BaseModel):
    valid: bool
    code: str | None = None
    discount_type: str | None = None
    value: float | None = None
    discount_amount: float | None = None
    message: str
