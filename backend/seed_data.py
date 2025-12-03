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
        {"category_id": electrical_commercial_id, "title": "Full Building Wiring", "description": "Complete commercial building wiring", "price": 25000, "duration_minutes": 960},
        {"category_id": electrical_commercial_id, "title": "3-Phase Electrical Line Installation", "description": "Industrial three phase power line", "price": 18000, "duration_minutes": 480},
        {"category_id": electrical_commercial_id, "title": "Industrial MCB/MCCB/DB Setup", "description": "Distribution board and circuit protection", "price": 12000, "duration_minutes": 360},
        {"category_id": electrical_commercial_id, "title": "Commercial AC Installation", "description": "Multi-unit commercial AC setup", "price": 8000, "duration_minutes": 240},
        {"category_id": electrical_commercial_id, "title": "UPS Power Backup Installation", "description": "Commercial grade UPS system", "price": 15000, "duration_minutes": 300},
        {"category_id": electrical_commercial_id, "title": "CCTV Security System Wiring", "description": "Complete security camera network", "price": 10000, "duration_minutes": 360},
        {"category_id": electrical_commercial_id, "title": "Commercial Lighting Layout Setup", "description": "Professional lighting system design", "price": 9000, "duration_minutes": 300},
        {"category_id": electrical_commercial_id, "title": "Electrical Load Expansion Approval", "description": "Load increase documentation and setup", "price": 20000, "duration_minutes": 480},
        {"category_id": electrical_commercial_id, "title": "Server Room Electrical Setup", "description": "Dedicated power for server infrastructure", "price": 22000, "duration_minutes": 540},
        {"category_id": electrical_commercial_id, "title": "Generator Wiring & Maintenance", "description": "Backup generator installation and service", "price": 16000, "duration_minutes": 420},
    ]
    
    # Seed services for Plumbers (Commercial)
    plumber_commercial_id = category_ids["Plumbers_commercial"]
    plumber_commercial_services = [
        {"category_id": plumber_commercial_id, "title": "Commercial Water Line Installation", "description": "Main water supply lines for buildings", "price": 15000, "duration_minutes": 480},
        {"category_id": plumber_commercial_id, "title": "High-Pressure Pipeline Setup", "description": "Industrial grade high-pressure pipes", "price": 20000, "duration_minutes": 540},
        {"category_id": plumber_commercial_id, "title": "Industrial Drainage Line Setup", "description": "Large capacity drainage system", "price": 18000, "duration_minutes": 600},
        {"category_id": plumber_commercial_id, "title": "Commercial Bathroom Fitting Installation", "description": "Multiple bathroom fittings for offices", "price": 12000, "duration_minutes": 420},
        {"category_id": plumber_commercial_id, "title": "Pump Room Setup", "description": "Water pump room installation and setup", "price": 25000, "duration_minutes": 720},
        {"category_id": plumber_commercial_id, "title": "Water Tank & Motor Pipeline Connection", "description": "Complete water storage system", "price": 10000, "duration_minutes": 360},
        {"category_id": plumber_commercial_id, "title": "Industrial Sewage Line Maintenance", "description": "Sewage system cleaning and repair", "price": 8000, "duration_minutes": 300},
        {"category_id": plumber_commercial_id, "title": "Commercial RO Plant Plumbing", "description": "Water purification system setup", "price": 22000, "duration_minutes": 480},
        {"category_id": plumber_commercial_id, "title": "Bulk Water Supply Line Repair", "description": "Main line repair and replacement", "price": 14000, "duration_minutes": 420},
    ]
    
    # Seed services for Painting Works (Commercial)
    painting_commercial_id = category_ids["Painting Works_commercial"]
    painting_commercial_services = [
        {"category_id": painting_commercial_id, "title": "Commercial Exterior Painting", "description": "Full building exterior paint", "price": 45000, "duration_minutes": 1440},
        {"category_id": painting_commercial_id, "title": "Office Interior Painting", "description": "Professional office space painting", "price": 28000, "duration_minutes": 960},
        {"category_id": painting_commercial_id, "title": "Industrial Paint Coating", "description": "Protective industrial coating", "price": 35000, "duration_minutes": 1200},
        {"category_id": painting_commercial_id, "title": "Factory Epoxy Painting", "description": "Durable epoxy floor coating", "price": 40000, "duration_minutes": 1440},
        {"category_id": painting_commercial_id, "title": "Corporate Building Painting", "description": "Premium corporate paint finish", "price": 50000, "duration_minutes": 1680},
        {"category_id": painting_commercial_id, "title": "Waterproof Paint Coating (Commercial Grade)", "description": "Weather-resistant exterior coating", "price": 32000, "duration_minutes": 1080},
        {"category_id": painting_commercial_id, "title": "Primer + 2 Coat Commercial Painting", "description": "Professional 3-layer paint system", "price": 38000, "duration_minutes": 1320},
        {"category_id": painting_commercial_id, "title": "Warehouse Metal Structure Painting", "description": "Industrial metal paint protection", "price": 42000, "duration_minutes": 1440},
        {"category_id": painting_commercial_id, "title": "Industrial Texture Painting", "description": "Decorative textured finish", "price": 30000, "duration_minutes": 960},
    ]
    
    # Seed services for Construction Works (Commercial)
    construction_commercial_id = category_ids["Construction Works_commercial"]
    construction_commercial_services = [
        {"category_id": construction_commercial_id, "title": "Block Masonry Construction", "description": "Commercial building block work", "price": 60000, "duration_minutes": 1920},
        {"category_id": construction_commercial_id, "title": "RCC Concrete Slab Work", "description": "Reinforced concrete slab construction", "price": 80000, "duration_minutes": 2400},
        {"category_id": construction_commercial_id, "title": "Floor Leveling (Industrial)", "description": "Large area floor leveling", "price": 35000, "duration_minutes": 960},
        {"category_id": construction_commercial_id, "title": "Boundary Wall Construction", "description": "Commercial property boundary wall", "price": 55000, "duration_minutes": 1680},
        {"category_id": construction_commercial_id, "title": "Shop/Office Renovation", "description": "Complete commercial space renovation", "price": 75000, "duration_minutes": 2160},
        {"category_id": construction_commercial_id, "title": "Structural Fabrication (Commercial)", "description": "Steel structure fabrication", "price": 65000, "duration_minutes": 1920},
        {"category_id": construction_commercial_id, "title": "Demolition Works", "description": "Safe commercial demolition service", "price": 40000, "duration_minutes": 960},
        {"category_id": construction_commercial_id, "title": "Industrial Waterproofing", "description": "Large scale waterproofing solution", "price": 50000, "duration_minutes": 1440},
        {"category_id": construction_commercial_id, "title": "Multi-Floor Building Repairs", "description": "Structural repair and maintenance", "price": 85000, "duration_minutes": 2400},
    ]
    
    # Seed services for Flooring Works (Commercial)
    flooring_commercial_id = category_ids["Flooring Works_commercial"]
    flooring_commercial_services = [
        {"category_id": flooring_commercial_id, "title": "Commercial Tiles Installation", "description": "High-traffic commercial tiling", "price": 25000, "duration_minutes": 960},
        {"category_id": flooring_commercial_id, "title": "Granite Flooring Work", "description": "Premium granite floor installation", "price": 45000, "duration_minutes": 1440},
        {"category_id": flooring_commercial_id, "title": "Industrial Epoxy Flooring", "description": "Chemical-resistant epoxy floor", "price": 55000, "duration_minutes": 1680},
        {"category_id": flooring_commercial_id, "title": "Marble Cutting & Polishing", "description": "Professional marble work", "price": 38000, "duration_minutes": 1200},
        {"category_id": flooring_commercial_id, "title": "Cement Screeding & Leveling", "description": "Commercial floor screeding", "price": 28000, "duration_minutes": 960},
        {"category_id": flooring_commercial_id, "title": "Warehouse Flooring", "description": "Heavy-duty warehouse floor", "price": 65000, "duration_minutes": 1920},
        {"category_id": flooring_commercial_id, "title": "Anti-Slip Commercial Flooring", "description": "Safety-grade non-slip flooring", "price": 42000, "duration_minutes": 1440},
        {"category_id": flooring_commercial_id, "title": "Vinyl Flooring (Office Use)", "description": "Modern vinyl floor installation", "price": 30000, "duration_minutes": 960},
    ]
    
    # Seed services for Wood Works (Commercial)
    woodwork_commercial_id = category_ids["Wood Works_commercial"]
    woodwork_commercial_services = [
        {"category_id": woodwork_commercial_id, "title": "Commercial Partition Woodwork", "description": "Office partition installation", "price": 35000, "duration_minutes": 960},
        {"category_id": woodwork_commercial_id, "title": "Office Workstation Setup", "description": "Modular workstation fabrication", "price": 45000, "duration_minutes": 1200},
        {"category_id": woodwork_commercial_id, "title": "Wooden Reception Desk Fabrication", "description": "Custom reception desk design", "price": 28000, "duration_minutes": 720},
        {"category_id": woodwork_commercial_id, "title": "Conference Table Fabrication", "description": "Large conference table setup", "price": 40000, "duration_minutes": 960},
        {"category_id": woodwork_commercial_id, "title": "Commercial Door Installation", "description": "Fire-rated commercial doors", "price": 15000, "duration_minutes": 480},
        {"category_id": woodwork_commercial_id, "title": "Wooden Wall Paneling", "description": "Decorative wall panel installation", "price": 50000, "duration_minutes": 1440},
        {"category_id": woodwork_commercial_id, "title": "Retail Display Unit Manufacturing", "description": "Custom retail display systems", "price": 38000, "duration_minutes": 1200},
        {"category_id": woodwork_commercial_id, "title": "Storage Cabinets for Commercial Spaces", "description": "Custom storage solutions", "price": 32000, "duration_minutes": 960},
    ]
    
    # Seed services for Interior & Exterior Designs (Commercial)
    interior_commercial_id = category_ids["Interior & Exterior Designs_commercial"]
    interior_commercial_services = [
        {"category_id": interior_commercial_id, "title": "Full Office Interior Design", "description": "Complete office interior solution", "price": 150000, "duration_minutes": 2880},
        {"category_id": interior_commercial_id, "title": "Corporate Workspace Design", "description": "Modern corporate office design", "price": 180000, "duration_minutes": 3360},
        {"category_id": interior_commercial_id, "title": "Exterior Elevation Design (3D)", "description": "Building facade design", "price": 85000, "duration_minutes": 1920},
        {"category_id": interior_commercial_id, "title": "Showroom Interior Design (Premium)", "description": "Luxury showroom interiors", "price": 200000, "duration_minutes": 3840},
        {"category_id": interior_commercial_id, "title": "Office False Ceiling Design", "description": "Modern ceiling design with lighting", "price": 65000, "duration_minutes": 1440},
        {"category_id": interior_commercial_id, "title": "Glass Partition + Lighting Design", "description": "Contemporary glass office spaces", "price": 120000, "duration_minutes": 2400},
        {"category_id": interior_commercial_id, "title": "Commercial Furniture Layout Planning", "description": "Space planning and furniture design", "price": 45000, "duration_minutes": 960},
        {"category_id": interior_commercial_id, "title": "Industrial Interior Design Package", "description": "Factory/warehouse interior design", "price": 95000, "duration_minutes": 2160},
    ]
    
    # Seed services for Ceiling Works (Commercial)
    ceiling_commercial_id = category_ids["Ceiling Works_commercial"]
    ceiling_commercial_services = [
        {"category_id": ceiling_commercial_id, "title": "Grid Ceiling Installation (Commercial)", "description": "Suspended grid ceiling system", "price": 35000, "duration_minutes": 960},
        {"category_id": ceiling_commercial_id, "title": "Gypsum Board Ceiling (Office)", "description": "Modern gypsum false ceiling", "price": 28000, "duration_minutes": 720},
        {"category_id": ceiling_commercial_id, "title": "POP Ceiling for Halls & Shops", "description": "Decorative POP ceiling work", "price": 32000, "duration_minutes": 960},
        {"category_id": ceiling_commercial_id, "title": "LED Panel Installation (Commercial)", "description": "Integrated LED ceiling panels", "price": 42000, "duration_minutes": 1080},
        {"category_id": ceiling_commercial_id, "title": "Acoustic Soundproof Ceiling", "description": "Sound-absorbing ceiling tiles", "price": 55000, "duration_minutes": 1440},
        {"category_id": ceiling_commercial_id, "title": "High-Rise Ceiling Works", "description": "Ceiling work for tall buildings", "price": 65000, "duration_minutes": 1680},
        {"category_id": ceiling_commercial_id, "title": "Industrial Aluminum Ceiling Installation", "description": "Durable aluminum ceiling system", "price": 48000, "duration_minutes": 1200},
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
        plumber_services + plumber_commercial_services +
        painting_services + painting_commercial_services +
        construction_services + construction_commercial_services +
        flooring_services + flooring_commercial_services +
        woodwork_services + woodwork_commercial_services +
        interior_services + interior_commercial_services +
        ceiling_services + ceiling_commercial_services
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
