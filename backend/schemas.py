from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: str
    stock: int
    is_trending: Optional[bool] = False

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# --- Order Item Schemas ---
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    price: float

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    delivery_address: str
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    delivery_address: Optional[str] = None
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
