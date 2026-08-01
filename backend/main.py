from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from database import engine, Base, get_db
import models
import schemas

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty (useful for Vercel deployments)
from database import SessionLocal
db = SessionLocal()
try:
    if db.query(models.Product).count() == 0:
        from seed import seed_db
        seed_db(clear=False)
finally:
    db.close()


app = FastAPI(title="Aura Market API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite React default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Aura Market API. Visit /docs for documentation."}

# --- Products Endpoints ---

@app.get("/api/products", response_model=List[schemas.Product])
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None, # 'price_asc' or 'price_desc'
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
        
    if search:
        query = query.filter(
            (models.Product.name.ilike(f"%{search}%")) | 
            (models.Product.description.ilike(f"%{search}%"))
        )
        
    if sort == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(models.Product.price.desc())
        
    return query.all()

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Product.category).distinct().all()
    return [c[0] for c in categories if c[0]]


@app.post("/api/products", response_model=schemas.Product, status_code=201)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
        image_url=product_in.image_url,
        category=product_in.category,
        stock=product_in.stock,
        is_trending=product_in.is_trending
    )
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product.name = product_in.name
    product.description = product_in.description
    product.price = product_in.price
    product.image_url = product_in.image_url
    product.category = product_in.category
    product.stock = product_in.stock
    product.is_trending = product_in.is_trending
    
    try:
        db.commit()
        db.refresh(product)
        return product
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")


@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    try:
        db.delete(product)
        db.commit()
        return {"message": f"Product with ID {product_id} deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")

# --- Orders Endpoints ---

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=201)
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    db_items = []
    total_amount = 0.0

    # Validate items and calculate total
    for item in order_in.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item.product_id} not found")
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.stock}, requested: {item.quantity}"
            )
            
        # Update stock
        product.stock -= item.quantity
        
        item_total = product.price * item.quantity
        total_amount += item_total
        
        db_item = models.OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )
        db_items.append(db_item)

    # Create order
    db_order = models.Order(
        customer_name=order_in.customer_name,
        customer_email=str(order_in.customer_email),
        delivery_address=order_in.delivery_address,
        total_amount=round(total_amount, 2),
        items=db_items
    )

    try:
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    # Returns all orders ordered by created_at descending
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()


@app.get("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.patch("/api/orders/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status: str = Query(..., description="Pending, Processing, Shipped, or Delivered"), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_statuses = ["Pending", "Processing", "Shipped", "Delivered"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    order.status = status
    db.commit()
    db.refresh(order)
    return order

