from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models

def seed_db(clear=True):
    if clear:
        # Recreate tables to clear old data
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


    db: Session = SessionLocal()
    try:
        # Mock product list
        products = [
            models.Product(
                name="Bharath Wireless ANC Headphones",
                description="Experience pristine, high-fidelity sound. Designed with active noise cancellation, custom audio tuning, and premium leather earcups for maximum comfort during long listening sessions.",
                price=24999.00,
                image_url="/assets/wireless_headphones.jpg",
                category="Audio",
                stock=25
            ),
            models.Product(
                name="Horizon Smartwatch Pro",
                description="A futuristic wearable with a titanium case, vibrant always-on AMOLED display, heart rate and oxygen monitoring, and up to 7 days of battery life.",
                price=28999.00,
                image_url="/assets/smart_watch.jpg",
                category="Wearables",
                stock=15
            ),
            models.Product(
                name="Nomad Mechanical Keyboard",
                description="Compact 65% mechanical keyboard with tactile hot-swappable switches, premium PBT keycaps, and customizable subtle RGB backlighting for an aesthetic typing experience.",
                price=12999.00,
                image_url="/assets/mechanical_keyboard.jpg",
                category="Accessories",
                stock=40
            ),
            models.Product(
                name="Vanguard Leather Backpack",
                description="Handcrafted from full-grain premium leather. Features a dedicated padded 16-inch laptop sleeve, hidden security pockets, and weather-resistant zippers.",
                price=14999.00,
                image_url="/assets/leather_backpack.jpg",
                category="Lifestyle",
                stock=10
            ),
            models.Product(
                name="Element Wool Felt Desk Pad",
                description="Add warmth and tactile comfort to your workspace. Made from premium sustainable wool felt with a non-slip natural rubber backing.",
                price=3999.00,
                image_url="/assets/desk_pad.jpg",
                category="Accessories",
                stock=50
            ),
            models.Product(
                name="Amber & Oak Scented Candle",
                description="Hand-poured natural soy wax candle in a textured minimalist ceramic vessel. Emits notes of amber, oakmoss, and warm vanilla to set a relaxing vibe.",
                price=2499.00,
                image_url="/assets/scented_candle.jpg",
                category="Lifestyle",
                stock=30
            ),
            models.Product(
                name="Bharath Organic Wild Honey",
                description="100% pure, raw, and organic forest honey collected from naturally occurring beehives. Rich in antioxidants and minerals.",
                price=799.00,
                image_url="/assets/organic_honey.jpg",
                category="Food",
                stock=50
            ),
            models.Product(
                name="Malabar Artisanal Filter Coffee",
                description="Premium blend of fresh chicory and Arabica beans, roasted to perfection to deliver the authentic, rich aroma of South Indian filter coffee.",
                price=449.00,
                image_url="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
                category="Food",
                stock=60
            ),
            models.Product(
                name="ZenBook Ultra-Slim Laptop",
                description="14-inch thin and light laptop featuring an Intel Core i7 processor, 16GB RAM, 512GB SSD, and a stunning 2K OLED display. Ideal for productivity on the go.",
                price=84999.00,
                image_url="https://images.unsplash.com/photo-1496181130204-755241524eab?q=80&w=600&auto=format&fit=crop",
                category="Laptops",
                stock=12
            ),
            models.Product(
                name="Horizon ROG Gaming Laptop",
                description="Ultimate gaming beast powered by NVIDIA RTX 4060, AMD Ryzen 7, 16GB RAM, and a 144Hz high-refresh display. Dominate every game with advanced cooling technology.",
                price=119999.00,
                image_url="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
                category="Laptops",
                stock=8
            )
        ]

        db.add_all(products)
        db.commit()
        print("Database successfully seeded with 10 premium products!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
