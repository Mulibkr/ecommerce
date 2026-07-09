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
        # Mock product list - 20 items of Organic Food, Vegetables, Fruits, Sweets, and Snacks
        products = [
            # Groceries / Organic Food (6 items)
            models.Product(
                name="Bharath Organic Wild Honey",
                description="100% pure, raw, and organic forest honey collected from naturally occurring beehives. Rich in antioxidants and minerals.",
                price=799.00,
                image_url="/assets/organic_honey.jpg",
                category="Organic Food",
                stock=50
            ),
            models.Product(
                name="Malabar Artisanal Filter Coffee",
                description="Premium blend of fresh chicory and Arabica beans, roasted to perfection to deliver the authentic, rich aroma of South Indian filter coffee.",
                price=449.00,
                image_url="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
                category="Organic Food",
                stock=60
            ),
            models.Product(
                name="Premium Basmati Rice (5kg)",
                description="Long-grain, aromatic aged basmati rice grown organically in the foothills of the Himalayas. Perfect for biryanis and everyday meals.",
                price=699.00,
                image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
                category="Organic Food",
                stock=25
            ),
            models.Product(
                name="Cold-Pressed Mustard Oil (1L)",
                description="Pure, unrefined mustard oil extracted using the traditional cold-pressing method to preserve its sharp aroma and nutrients.",
                price=349.00,
                image_url="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
                category="Organic Food",
                stock=30
            ),
            models.Product(
                name="Organic Turmeric Powder (250g)",
                description="High-curcumin turmeric powder sourced from organic farms in Salem. Ground to perfection with no added colors or preservatives.",
                price=189.00,
                image_url="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
                category="Organic Food",
                stock=45
            ),
            models.Product(
                name="A2 Gir Cow Ghee (500ml)",
                description="Traditional Bilona method ghee prepared from the A2 milk of free-grazing Indian Gir cows. Highly nutritious and aromatic.",
                price=999.00,
                image_url="https://images.unsplash.com/photo-1622484211148-716d48e65306?q=80&w=600&auto=format&fit=crop",
                category="Organic Food",
                stock=15
            ),

            # Vegetables (5 items)
            models.Product(
                name="Organic Fresh Potatoes (1kg)",
                description="Earthy, farm-fresh potatoes grown without synthetic pesticides. Perfect for roasting, boiling, and curry recipes.",
                price=79.00,
                image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop",
                category="Vegetables",
                stock=80
            ),
            models.Product(
                name="Organic Red Onions (1kg)",
                description="Crisp, pungent red onions harvested from local organic farms. Essential for salads, curries, and base gravies.",
                price=69.00,
                image_url="https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=600&auto=format&fit=crop",
                category="Vegetables",
                stock=75
            ),
            models.Product(
                name="Vine-Ripened Tomatoes (1kg)",
                description="Juicy, plump red tomatoes picked fresh from the vine. Sweet and tangy, ideal for fresh pasta sauces and salads.",
                price=89.00,
                image_url="https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=600&auto=format&fit=crop",
                category="Vegetables",
                stock=50
            ),
            models.Product(
                name="Farm-Fresh Spinach (Bunch)",
                description="Vibrant green, tender spinach leaves packed with iron and vitamins. Freshly cut and washed, ready for cooking.",
                price=39.00,
                image_url="https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop",
                category="Vegetables",
                stock=30
            ),
            models.Product(
                name="Organic Carrots (500g)",
                description="Sweet, crunchy orange carrots rich in beta-carotene. Grown locally and freshly harvested.",
                price=59.00,
                image_url="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop",
                category="Vegetables",
                stock=40
            ),

            # Fruits (4 items)
            models.Product(
                name="Premium Alphonso Mangoes (6pcs)",
                description="The king of mangoes. Extremely sweet, rich, fiberless, and intensely aromatic. Sourced directly from Devgad farms.",
                price=699.00,
                image_url="https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop",
                category="Fruits",
                stock=20
            ),
            models.Product(
                name="Organic Cavendish Bananas (1 Dozen)",
                description="Sweet and creamy organic bananas. High in potassium and dietary fiber, a perfect healthy snack.",
                price=99.00,
                image_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop",
                category="Fruits",
                stock=40
            ),
            models.Product(
                name="Kashmiri Royal Gala Apples (4pcs)",
                description="Crisp, red apples with a sweet, mild flavor sourced from the clean orchards of Kashmir valley.",
                price=199.00,
                image_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop",
                category="Fruits",
                stock=35
            ),
            models.Product(
                name="Fresh Sweet Pomegranates (2pcs)",
                description="Plump pomegranates filled with deep red, juicy, and sweet arils. Handpicked for quality.",
                price=149.00,
                image_url="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600&auto=format&fit=crop",
                category="Fruits",
                stock=25
            ),

            # Sweets (3 items)
            models.Product(
                name="Artisanal Kaju Katli (250g)",
                description="Classic Indian sweet made from premium cashews, sugar, and decorated with silver leaf. Rich and melt-in-the-mouth texture.",
                price=349.00,
                image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
                category="Sweets",
                stock=30
            ),
            models.Product(
                name="Pure Milk Peda (250g)",
                description="Traditional sweet prepared by evaporating organic milk until thick, sweetened, and flavored with green cardamom.",
                price=249.00,
                image_url="https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop",
                category="Sweets",
                stock=35
            ),
            models.Product(
                name="Premium Dry Fruit Laddu (250g)",
                description="Nutritious laddus made from organic dates, almonds, cashews, pistachios, and a touch of pure cow ghee. No added refined sugar.",
                price=299.00,
                image_url="https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop",
                category="Sweets",
                stock=25
            ),

            # Snacks (2 items)
            models.Product(
                name="Baked Organic Banana Chips (200g)",
                description="Crisp and lightly salted chips made from organic raw bananas, baked in cold-pressed coconut oil for a healthy crunch.",
                price=129.00,
                image_url="https://images.unsplash.com/photo-1600189020840-e9918c25269d?q=80&w=600&auto=format&fit=crop",
                category="Snacks",
                stock=50
            ),
            models.Product(
                name="Spicy Roasted Makhana (150g)",
                description="Nutritious lotus seeds slow-roasted to a perfect crunch, spiced with organic black pepper, turmeric, and rock salt.",
                price=179.00,
                image_url="https://images.unsplash.com/photo-1618043063544-e2007841c7b8?q=80&w=600&auto=format&fit=crop",
                category="Snacks",
                stock=40
            )
        ]

        db.add_all(products)
        db.commit()
        print("Database successfully seeded with 20 premium Bharath organic farm products!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
