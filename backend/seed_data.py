import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Seed categories
categories = [
    # Home Services
    {"name": "Construction Works", "icon": "construct", "type": "home", "description": "All types of construction and civil work"},
    {"name": "Plumbers", "icon": "water", "type": "home", "description": "Plumbing repairs and installations"},
    {"name": "Electric Works", "icon": "flash", "type": "home", "description": "Electrical repairs and installations"},
    {"name": "Painting Works", "icon": "color-palette", "type": "home", "description": "Interior and exterior painting"},
    {"name": "Flooring Works", "icon": "grid", "type": "home", "description": "Tile, marble, and flooring services"},
    {"name": "Wood Works", "icon": "hammer", "type": "home", "description": "Carpentry and woodwork services"},
    {"name": "Interior & Exterior Designs", "icon": "home", "type": "home", "description": "Interior and exterior design services"},
    {"name": "Ceiling Works", "icon": "cube", "type": "home", "description": "False ceiling and POP work"},
    # Commercial Services
    {"name": "Construction Works", "icon": "construct", "type": "commercial", "description": "Commercial construction projects"},
    {"name": "Plumbers", "icon": "water", "type": "commercial", "description": "Commercial plumbing services"},
    {"name": "Electric Works", "icon": "flash", "type": "commercial", "description": "Commercial electrical services"},
    {"name": "Painting Works", "icon": "color-palette", "type": "commercial", "description": "Commercial painting services"},
    {"name": "Flooring Works", "icon": "grid", "type": "commercial", "description": "Commercial flooring services"},
    {"name": "Wood Works", "icon": "hammer", "type": "commercial", "description": "Commercial carpentry services"},
    {"name": "Interior & Exterior Designs", "icon": "home", "type": "commercial", "description": "Commercial design services"},
    {"name": "Ceiling Works", "icon": "cube", "type": "commercial", "description": "Commercial ceiling work"},
]

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.services.delete_many({})
    await db.users.delete_many({})
    
    # Insert categories
    result = await db.categories.insert_many(categories)
    category_ids = {cat["name"] + "_" + cat["type"]: str(result.inserted_ids[i]) for i, cat in enumerate(categories)}
    
    print(f"Seeded {len(categories)} categories")
    
    # Seed services for Electrical Works (Home)
    electrical_home_id = category_ids["Electric Works_home"]
    electrical_services = [
        {"category_id": electrical_home_id, "title": "Fan Installation", "description": "Install ceiling or wall fan", "price": 900, "duration_minutes": 60},
        {"category_id": electrical_home_id, "title": "Full Home Wiring", "description": "Complete house wiring", "price": 15000, "duration_minutes": 480},
        {"category_id": electrical_home_id, "title": "Inverter Installation", "description": "Install inverter with battery", "price": 2500, "duration_minutes": 120},
        {"category_id": electrical_home_id, "title": "Short Circuit Fix", "description": "Identify and fix short circuit", "price": 800, "duration_minutes": 90},
        {"category_id": electrical_home_id, "title": "AC Installation", "description": "Split AC installation", "price": 3000, "duration_minutes": 120},
        {"category_id": electrical_home_id, "title": "Switch/Socket Replacement", "description": "Replace switches or sockets", "price": 300, "duration_minutes": 30},
        {"category_id": electrical_home_id, "title": "Geyser Installation", "description": "Water heater installation", "price": 1500, "duration_minutes": 90},
        {"category_id": electrical_home_id, "title": "LED Light Installation", "description": "Install LED lights", "price": 500, "duration_minutes": 45},
    ]
    
    # Seed services for Electrical Works (Commercial)
    electrical_commercial_id = category_ids["Electric Works_commercial"]
    electrical_commercial_services = [
        {"category_id": electrical_commercial_id, "title": "Full Commercial Wiring", "description": "Complete office/shop wiring", "price": 6000, "duration_minutes": 480},
        {"category_id": electrical_commercial_id, "title": "3-Phase Electrical Line Work", "description": "Three phase line installation", "price": 12000, "duration_minutes": 360},
        {"category_id": electrical_commercial_id, "title": "Industrial MCCB/MCB/DB Works", "description": "Distribution board installation", "price": 8000, "duration_minutes": 240},
        {"category_id": electrical_commercial_id, "title": "Commercial AC Installation", "description": "Commercial AC setup", "price": 4000, "duration_minutes": 180},
        {"category_id": electrical_commercial_id, "title": "Office UPS Systems", "description": "UPS installation and setup", "price": 7500, "duration_minutes": 240},
        {"category_id": electrical_commercial_id, "title": "CCTV/Security System Wiring", "description": "Security camera wiring", "price": 3000, "duration_minutes": 180},
    ]
    
    # Seed services for Plumbers (Home)
    plumber_home_id = category_ids["Plumbers_home"]
    plumber_services = [
        {"category_id": plumber_home_id, "title": "Tap Repair", "description": "Fix leaking taps", "price": 400, "duration_minutes": 45},
        {"category_id": plumber_home_id, "title": "Toilet Installation", "description": "Install new toilet", "price": 2500, "duration_minutes": 120},
        {"category_id": plumber_home_id, "title": "Pipe Leak Repair", "description": "Fix pipe leakage", "price": 800, "duration_minutes": 90},
        {"category_id": plumber_home_id, "title": "Bathroom Fitting", "description": "Complete bathroom fitting", "price": 5000, "duration_minutes": 240},
        {"category_id": plumber_home_id, "title": "Wash Basin Installation", "description": "Install wash basin", "price": 1500, "duration_minutes": 90},
        {"category_id": plumber_home_id, "title": "Drainage Cleaning", "description": "Clean blocked drains", "price": 1200, "duration_minutes": 60},
        {"category_id": plumber_home_id, "title": "Water Tank Installation", "description": "Install overhead water tank", "price": 3500, "duration_minutes": 180},
    ]
    
    # Seed services for Painting Works (Home)
    painting_home_id = category_ids["Painting Works_home"]
    painting_services = [
        {"category_id": painting_home_id, "title": "1 Room Painting", "description": "Paint single room", "price": 3500, "duration_minutes": 240},
        {"category_id": painting_home_id, "title": "Full House Painting", "description": "Complete house painting", "price": 15000, "duration_minutes": 960},
        {"category_id": painting_home_id, "title": "Exterior Wall Painting", "description": "Paint exterior walls", "price": 8000, "duration_minutes": 480},
        {"category_id": painting_home_id, "title": "Texture Painting", "description": "Decorative texture painting", "price": 5000, "duration_minutes": 360},
        {"category_id": painting_home_id, "title": "Wood Polish", "description": "Polish wooden furniture", "price": 2500, "duration_minutes": 180},
        {"category_id": painting_home_id, "title": "Waterproofing", "description": "Waterproof walls/roof", "price": 6000, "duration_minutes": 360},
    ]
    
    # Seed services for Construction Works (Home)
    construction_home_id = category_ids["Construction Works_home"]
    construction_services = [
        {"category_id": construction_home_id, "title": "Wall Construction", "description": "Build new walls", "price": 8000, "duration_minutes": 480},
        {"category_id": construction_home_id, "title": "Room Addition", "description": "Add new room", "price": 50000, "duration_minutes": 2400},
        {"category_id": construction_home_id, "title": "Balcony Construction", "description": "Build balcony", "price": 25000, "duration_minutes": 960},
        {"category_id": construction_home_id, "title": "Plastering Work", "description": "Wall plastering", "price": 4500, "duration_minutes": 360},
        {"category_id": construction_home_id, "title": "Tile Work", "description": "Floor/wall tiling", "price": 6000, "duration_minutes": 480},
    ]
    
    # Seed services for Wood Works (Home)
    woodwork_home_id = category_ids["Wood Works_home"]
    woodwork_services = [
        {"category_id": woodwork_home_id, "title": "Door Installation", "description": "Install wooden door", "price": 4500, "duration_minutes": 180},
        {"category_id": woodwork_home_id, "title": "Window Frame", "description": "Wooden window frame", "price": 3500, "duration_minutes": 120},
        {"category_id": woodwork_home_id, "title": "Wardrobe Making", "description": "Custom wardrobe", "price": 15000, "duration_minutes": 960},
        {"category_id": woodwork_home_id, "title": "Furniture Repair", "description": "Fix broken furniture", "price": 1500, "duration_minutes": 90},
        {"category_id": woodwork_home_id, "title": "Modular Kitchen", "description": "Complete kitchen setup", "price": 45000, "duration_minutes": 1440},
    ]
    
    # Seed services for Interior Design (Home)
    interior_home_id = category_ids["Interior & Exterior Designs_home"]
    interior_services = [
        {"category_id": interior_home_id, "title": "Living Room Design", "description": "Complete living room design", "price": 25000, "duration_minutes": 960},
        {"category_id": interior_home_id, "title": "Bedroom Design", "description": "Complete bedroom design", "price": 20000, "duration_minutes": 720},
        {"category_id": interior_home_id, "title": "Modular Kitchen Design", "description": "Kitchen interior design", "price": 35000, "duration_minutes": 1200},
        {"category_id": interior_home_id, "title": "Home Office Setup", "description": "Office interior design", "price": 18000, "duration_minutes": 600},
    ]
    
    # Seed services for Ceiling Works (Home)
    ceiling_home_id = category_ids["Ceiling Works_home"]
    ceiling_services = [
        {"category_id": ceiling_home_id, "title": "False Ceiling", "description": "POP false ceiling", "price": 8000, "duration_minutes": 480},
        {"category_id": ceiling_home_id, "title": "Gypsum Ceiling", "description": "Gypsum board ceiling", "price": 7000, "duration_minutes": 420},
        {"category_id": ceiling_home_id, "title": "POP Design Work", "description": "Decorative POP work", "price": 5000, "duration_minutes": 360},
        {"category_id": ceiling_home_id, "title": "Ceiling Repair", "description": "Fix damaged ceiling", "price": 2500, "duration_minutes": 180},
    ]
    
    # Seed services for Flooring Works (Home)
    flooring_home_id = category_ids["Flooring Works_home"]
    flooring_services = [
        {"category_id": flooring_home_id, "title": "Tile Flooring", "description": "Ceramic tile installation", "price": 6500, "duration_minutes": 480},
        {"category_id": flooring_home_id, "title": "Marble Flooring", "description": "Marble floor installation", "price": 12000, "duration_minutes": 720},
        {"category_id": flooring_home_id, "title": "Wooden Flooring", "description": "Wooden floor installation", "price": 9000, "duration_minutes": 600},
        {"category_id": flooring_home_id, "title": "Vinyl Flooring", "description": "Vinyl sheet flooring", "price": 4500, "duration_minutes": 360},
    ]
    
    # Combine all services
    all_services = (
        electrical_services + electrical_commercial_services +
        plumber_services + painting_services + construction_services +
        woodwork_services + interior_services + ceiling_services + flooring_services
    )
    
    await db.services.insert_many(all_services)
    print(f"Seeded {len(all_services)} services")
    
    # Seed a demo user
    demo_user = {
        "name": "Demo User",
        "phone": "9876543210",
        "email": "demo@workhub.com",
        "preferred_language": "English",
        "wallet_balance": 5000.0
    }
    await db.users.insert_one(demo_user)
    print("Seeded demo user")
    
    print("Database seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
