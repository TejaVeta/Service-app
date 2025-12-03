from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Custom ObjectId handler
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

# Models
class User(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[str] = Field(None, alias="_id")
    name: str
    phone: str
    email: Optional[str] = None
    preferred_language: str = "English"
    wallet_balance: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None

class LoginRequest(BaseModel):
    phone: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

class Category(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[str] = Field(None, alias="_id")
    name: str
    icon: str
    type: str  # "home" or "commercial"
    description: Optional[str] = None
    image_url: Optional[str] = None

class Service(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[str] = Field(None, alias="_id")
    category_id: str
    title: str
    description: Optional[str] = None
    price: float
    duration_minutes: int = 60
    image_url: Optional[str] = None

class CartItem(BaseModel):
    service_id: str
    title: str
    price: float
    quantity: int = 1

class Cart(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[str] = Field(None, alias="_id")
    customer_id: str
    items: List[CartItem] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AddToCartRequest(BaseModel):
    customer_id: str
    service_id: str
    title: str
    price: float

class RemoveFromCartRequest(BaseModel):
    customer_id: str
    service_id: str

class BookingAddress(BaseModel):
    street: str
    city: str
    state: str
    pincode: str
    landmark: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: Optional[str] = Field(None, alias="_id")
    customer_id: str
    customer_name: str
    customer_phone: str
    services: List[CartItem]
    total_price: float
    status: str = "pending"  # pending, assigned, in_progress, completed, cancelled
    scheduled_at: datetime
    address: BookingAddress
    images: List[str] = []  # base64 images
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    customer_id: str
    customer_name: str
    customer_phone: str
    services: List[CartItem]
    total_price: float
    scheduled_at: datetime
    address: BookingAddress
    images: List[str] = []

# Auth Routes
@api_router.post("/auth/login")
async def login(request: LoginRequest):
    # Mock OTP - in production, send actual OTP via SMS
    return {"success": True, "message": "OTP sent to your phone", "otp": "123456"}

@api_router.post("/auth/verify-otp")
async def verify_otp(request: OTPVerifyRequest):
    # Mock verification - accept any 6-digit OTP for demo
    if len(request.otp) == 6:
        # Find or create user
        user = await db.users.find_one({"phone": request.phone})
        if not user:
            # Create new user
            new_user = {
                "name": f"User {request.phone[-4:]}",
                "phone": request.phone,
                "preferred_language": "English",
                "wallet_balance": 1000.0,  # Demo wallet balance
                "created_at": datetime.utcnow()
            }
            result = await db.users.insert_one(new_user)
            new_user["_id"] = str(result.inserted_id)
            user = new_user
        else:
            user["_id"] = str(user["_id"])
        
        return {
            "success": True,
            "token": f"mock_token_{user['_id']}",
            "user": user
        }
    return {"success": False, "message": "Invalid OTP"}

@api_router.get("/auth/me")
async def get_current_user(customer_id: str):
    user = await db.users.find_one({"_id": ObjectId(customer_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

# Category Routes
@api_router.get("/categories")
async def get_categories(type: Optional[str] = None):
    query = {}
    if type:
        query["type"] = type
    categories = await db.categories.find(query).to_list(100)
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    return categories

# Service Routes
@api_router.get("/categories/{category_id}/services")
async def get_category_services(category_id: str):
    services = await db.services.find({"category_id": category_id}).to_list(100)
    for service in services:
        service["_id"] = str(service["_id"])
    return services

@api_router.get("/services/{service_id}")
async def get_service(service_id: str):
    service = await db.services.find_one({"_id": ObjectId(service_id)})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service["_id"] = str(service["_id"])
    return service

# Cart Routes
@api_router.post("/cart/add")
async def add_to_cart(request: AddToCartRequest):
    # Get or create cart
    cart = await db.carts.find_one({"customer_id": request.customer_id})
    
    if cart:
        # Check if item already exists
        item_exists = False
        for item in cart.get("items", []):
            if item["service_id"] == request.service_id:
                item["quantity"] += 1
                item_exists = True
                break
        
        if not item_exists:
            cart.setdefault("items", []).append({
                "service_id": request.service_id,
                "title": request.title,
                "price": request.price,
                "quantity": 1
            })
        
        cart["updated_at"] = datetime.utcnow()
        await db.carts.update_one(
            {"customer_id": request.customer_id},
            {"$set": cart}
        )
    else:
        cart = {
            "customer_id": request.customer_id,
            "items": [{
                "service_id": request.service_id,
                "title": request.title,
                "price": request.price,
                "quantity": 1
            }],
            "updated_at": datetime.utcnow()
        }
        await db.carts.insert_one(cart)
    
    return {"success": True, "message": "Item added to cart"}

@api_router.get("/cart/{customer_id}")
async def get_cart(customer_id: str):
    cart = await db.carts.find_one({"customer_id": customer_id})
    if not cart:
        return {"items": [], "total": 0}
    
    cart["_id"] = str(cart["_id"])
    total = sum(item["price"] * item["quantity"] for item in cart.get("items", []))
    return {"items": cart.get("items", []), "total": total}

@api_router.post("/cart/remove")
async def remove_from_cart(request: RemoveFromCartRequest):
    cart = await db.carts.find_one({"customer_id": request.customer_id})
    if cart:
        cart["items"] = [item for item in cart.get("items", []) if item["service_id"] != request.service_id]
        cart["updated_at"] = datetime.utcnow()
        await db.carts.update_one(
            {"customer_id": request.customer_id},
            {"$set": cart}
        )
    return {"success": True, "message": "Item removed from cart"}

@api_router.post("/cart/update-quantity")
async def update_cart_quantity(customer_id: str, service_id: str, quantity: int):
    cart = await db.carts.find_one({"customer_id": customer_id})
    if cart:
        for item in cart.get("items", []):
            if item["service_id"] == service_id:
                if quantity <= 0:
                    cart["items"].remove(item)
                else:
                    item["quantity"] = quantity
                break
        cart["updated_at"] = datetime.utcnow()
        await db.carts.update_one(
            {"customer_id": customer_id},
            {"$set": cart}
        )
    return {"success": True, "message": "Cart updated"}

@api_router.delete("/cart/{customer_id}")
async def clear_cart(customer_id: str):
    await db.carts.delete_one({"customer_id": customer_id})
    return {"success": True, "message": "Cart cleared"}

# Booking Routes
@api_router.post("/booking")
async def create_booking(booking: BookingCreate):
    booking_dict = booking.model_dump()
    booking_dict["status"] = "pending"
    booking_dict["created_at"] = datetime.utcnow()
    
    result = await db.bookings.insert_one(booking_dict)
    booking_dict["_id"] = str(result.inserted_id)
    
    # Clear cart after booking
    await db.carts.delete_one({"customer_id": booking.customer_id})
    
    return {
        "success": True,
        "booking_id": str(result.inserted_id),
        "message": "Booking created successfully"
    }

@api_router.get("/booking/{booking_id}")
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking["_id"] = str(booking["_id"])
    return booking

@api_router.get("/bookings/customer/{customer_id}")
async def get_customer_bookings(customer_id: str):
    bookings = await db.bookings.find({"customer_id": customer_id}).sort("created_at", -1).to_list(100)
    for booking in bookings:
        booking["_id"] = str(booking["_id"])
    return bookings

# User Profile Routes
@api_router.put("/user/profile")
async def update_profile(customer_id: str, name: Optional[str] = None, preferred_language: Optional[str] = None):
    update_data = {}
    if name:
        update_data["name"] = name
    if preferred_language:
        update_data["preferred_language"] = preferred_language
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(customer_id)},
            {"$set": update_data}
        )
    
    return {"success": True, "message": "Profile updated"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
