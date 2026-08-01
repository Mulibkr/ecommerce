from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=False, index=True)
    stock = Column(Integer, default=0)
    is_trending = Column(Boolean, default=False)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    delivery_address = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Pending") # Pending, Processing, Shipped, Delivered
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False) # Price at time of order

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
