from app.models import Product

# Mock product data for premium tea showcase
PRODUCTS = [
    Product(
        id=1,
        name="Dragon Well Green Tea",
        price=42.00,
        category="green",
        material="China",
        image="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500",
        description="Premium hand-picked Longjing tea from Hangzhou with a smooth, nutty flavor and jade-green leaves.",
        customizable=True,
    ),
    Product(
        id=2,
        name="Ceremonial Matcha",
        price=65.00,
        category="green",
        material="Japan",
        image="https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=500",
        description="Stone-ground first harvest matcha from Uji, Kyoto. Vibrant green with umami richness.",
        customizable=True,
    ),
    Product(
        id=3,
        name="Darjeeling First Flush",
        price=38.00,
        category="black",
        material="India",
        image="https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=500",
        description="The champagne of teas - delicate muscatel notes from the Himalayan foothills.",
        customizable=False,
    ),
    Product(
        id=4,
        name="Assam Golden Tips",
        price=45.00,
        category="black",
        material="India",
        image="https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500",
        description="Rich, malty black tea with golden tips from the finest Assam gardens.",
        customizable=False,
    ),
    Product(
        id=5,
        name="High Mountain Oolong",
        price=55.00,
        category="oolong",
        material="Taiwan",
        image="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=500",
        description="Grown at 2,000m elevation in Ali Shan. Creamy, floral with a buttery finish.",
        customizable=False,
    ),
    Product(
        id=6,
        name="Tie Guan Yin",
        price=48.00,
        category="oolong",
        material="China",
        image="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
        description="Iron Goddess of Mercy - a legendary oolong with orchid fragrance and honey notes.",
        customizable=True,
    ),
    Product(
        id=7,
        name="Sencha Fukamushi",
        price=32.00,
        category="green",
        material="Japan",
        image="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500",
        description="Deep-steamed Japanese green tea with a rich, sweet vegetal flavor.",
        customizable=True,
    ),
    Product(
        id=8,
        name="Earl Grey Imperial",
        price=28.00,
        category="black",
        material="India",
        image="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500",
        description="Classic bergamot-infused black tea blend with blue cornflower petals.",
        customizable=False,
    ),
    Product(
        id=9,
        name="Chamomile Dreams",
        price=22.00,
        category="herbal",
        material="China",
        image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500",
        description="Pure Egyptian chamomile flowers for a calming, golden infusion.",
        customizable=False,
    ),
    Product(
        id=10,
        name="Jasmine Pearl",
        price=52.00,
        category="green",
        material="China",
        image="https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=500",
        description="Hand-rolled pearls scented with fresh jasmine blossoms over seven nights.",
        customizable=True,
    ),
    Product(
        id=11,
        name="Oriental Beauty",
        price=68.00,
        category="oolong",
        material="Taiwan",
        image="https://images.unsplash.com/photo-1556881286-fc6915169721?w=500",
        description="Honey-sweet oolong with notes of ripe fruit, naturally bug-bitten leaves.",
        customizable=True,
    ),
    Product(
        id=12,
        name="Gyokuro Shade-Grown",
        price=75.00,
        category="green",
        material="Japan",
        image="https://images.unsplash.com/photo-1515696955266-4f67e13219e8?w=500",
        description="Japan's most prized green tea, shaded 20 days for intense umami sweetness.",
        customizable=False,
    ),
    Product(
        id=13,
        name="Peppermint Refresh",
        price=18.00,
        category="herbal",
        material="India",
        image="https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=500",
        description="Cool, invigorating peppermint leaves perfect for digestive wellness.",
        customizable=False,
    ),
    Product(
        id=14,
        name="Pu-erh Aged Reserve",
        price=85.00,
        category="black",
        material="China",
        image="https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=500",
        description="15-year aged fermented tea from Yunnan with earthy, smooth complexity.",
        customizable=False,
    ),
    Product(
        id=15,
        name="Rooibos Vanilla",
        price=24.00,
        category="herbal",
        material="India",
        image="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500",
        description="Caffeine-free South African red bush tea with natural vanilla bean.",
        customizable=False,
    ),
]


def get_all_products():
    """Get all products"""
    return PRODUCTS


def get_product_by_id(product_id: int):
    """Get a product by its ID"""
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None


def get_products_by_category(category: str):
    """Get all products in a specific category"""
    return [product for product in PRODUCTS if product.category == category]
