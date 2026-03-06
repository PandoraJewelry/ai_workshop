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
