from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models

def seed_db():
    # Recreate tables to clear old data
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Mock product list
        products = [
            models.Product(
                name="Aura Wireless ANC Headphones",
                description="Experience pristine, high-fidelity sound. Designed with active noise cancellation, custom audio tuning, and premium leather earcups for maximum comfort during long listening sessions.",
                price=299.99,
                image_url="/assets/wireless_headphones.jpg",
                category="Audio",
                stock=25
            ),
            models.Product(
                name="Horizon Smartwatch Pro",
                description="A futuristic wearable with a titanium case, vibrant always-on AMOLED display, heart rate and oxygen monitoring, and up to 7 days of battery life.",
                price=349.99,
                image_url="/assets/smart_watch.jpg",
                category="Wearables",
                stock=15
            ),
            models.Product(
                name="Nomad Mechanical Keyboard",
                description="Compact 65% mechanical keyboard with tactile hot-swappable switches, premium PBT keycaps, and customizable subtle RGB backlighting for an aesthetic typing experience.",
                price=159.99,
                image_url="/assets/mechanical_keyboard.jpg",
                category="Accessories",
                stock=40
            ),
            models.Product(
                name="Vanguard Leather Backpack",
                description="Handcrafted from full-grain premium leather. Features a dedicated padded 16-inch laptop sleeve, hidden security pockets, and weather-resistant zippers.",
                price=189.99,
                image_url="/assets/leather_backpack.jpg",
                category="Lifestyle",
                stock=10
            ),
            models.Product(
                name="Element Wool Felt Desk Pad",
                description="Add warmth and tactile comfort to your workspace. Made from premium sustainable wool felt with a non-slip natural rubber backing.",
                price=49.99,
                image_url="/assets/desk_pad.jpg",
                category="Accessories",
                stock=50
            ),
            models.Product(
                name="Amber & Oak Scented Candle",
                description="Hand-poured natural soy wax candle in a textured minimalist ceramic vessel. Emits notes of amber, oakmoss, and warm vanilla to set a relaxing vibe.",
                price=29.99,
                image_url="/assets/scented_candle.jpg",
                category="Lifestyle",
                stock=30
            )
        ]

        db.add_all(products)
        db.commit()
        print("Database successfully seeded with 6 premium products!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
