# Backend Setup & Database Guide

## Current Configuration

### Backend Server
- **Port**: 8000 (as configured in your frontend axios)
- **Base URL**: `http://localhost:8000/api/v1`
- **Database**: MongoDB (via Mongoose)

### API Endpoints
- `GET /api/v1/bikes` - Fetch all bikes
- `GET /api/v1/bikes/:bikeId` - Fetch bike by ID
- `GET /api/v1/bikes/city/:city` - Fetch bikes by city
- `POST /api/v1/bikes` - Create new bike (Admin only)
- `PATCH /api/v1/bikes/:bikeId` - Update bike (Admin only)
- `DELETE /api/v1/bikes/:bikeId` - Delete bike (Admin only)

---

## Setup Instructions

### 1. Create .env file in backend directory

```bash
cd backend
```

Create a `.env` file with the following content:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/mrbike
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mrbike

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Other configurations
NODE_ENV=development
```

### 2. Start MongoDB

**If using local MongoDB:**
```bash
mongod
```

**If using MongoDB Atlas:**
- Make sure your cluster is running
- Whitelist your IP address
- Use the connection string from Atlas

### 3. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server is running on port: 8000
MongoDB connected: <your-db-host>
```

---

## Adding Bikes to Database

### Method 1: Using API (Postman/Thunder Client)

**Important**: You need to be logged in as admin to create bikes.

#### Step 1: Register an Admin User
```
POST http://localhost:8000/api/v1/users/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

#### Step 2: Login as Admin
```
POST http://localhost:8000/api/v1/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Save the cookies/token from the response.

#### Step 3: Create Bikes
```
POST http://localhost:8000/api/v1/bikes
Content-Type: application/json
Cookie: <your-auth-cookie>

{
  "name": "Himalayan BS6",
  "packageCost": 1399,
  "location": "INA Metro",
  "city": "vizag",
  "numberOfVehicles": 3,
  "imageUrl": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
}
```

### Method 2: Using MongoDB Directly

Connect to MongoDB and insert bikes:

```javascript
// Connect to MongoDB
use mrbike

// Insert sample bikes
db.bikes.insertMany([
  {
    name: "himalayan bs6",
    packageCost: 1399,
    location: "ina metro",
    city: "vizag",
    numberOfVehicles: 3,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "fz s v3",
    packageCost: 749,
    location: "ina metro",
    city: "vizag",
    numberOfVehicles: 2,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "classic 350 bs6",
    packageCost: 1149,
    location: "ina metro",
    city: "vizag",
    numberOfVehicles: 2,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Verify bikes were inserted
db.bikes.find()
```

---

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Check Backend Connection
Open browser console and navigate to `/search` page. You should see:
- "Fetching bikes from backend with params: ..."
- "Backend response: ..."
- "Successfully fetched X bikes from database"

### 4. Test API Directly
Visit: http://localhost:8000/api/v1/bikes?city=vizag&available=true

You should see:
```json
{
  "success": true,
  "data": {
    "bikes": [...],
    "currentPage": 1,
    "totalPages": 1,
    "totalBikes": 3
  },
  "message": "Bikes fetched successfully"
}
```

---

## Troubleshooting

### Error: Cannot connect to backend server
- Verify backend is running: `ps aux | grep node`
- Check if port 8000 is in use: `lsof -i :8000` (Mac/Linux) or `netstat -ano | findstr :8000` (Windows)
- Verify .env file has `PORT=8000`

### Error: MongoDB connection failed
- Check if MongoDB is running: `mongod --version`
- Verify MONGO_URI in .env file
- Check MongoDB logs for errors

### Error: No bikes found
- Check if bikes exist in database: `db.bikes.find()`
- Verify query parameters are correct
- Check backend logs for errors

### CORS Error
- Verify frontend port (5173 or 3000) is in CORS whitelist in `backend/src/app.js`
- Check browser console for specific CORS error

---

## Database Schema

### Bike Model
```javascript
{
  name: String (required, lowercase),
  packageCost: Number (required),
  location: String (required, lowercase),
  city: String (required, lowercase),
  numberOfVehicles: Number (required, min: 0),
  imageUrl: String,
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Quick Start Commands

```bash
# Terminal 1 - Start MongoDB (if local)
mongod

# Terminal 2 - Start Backend
cd backend
npm run dev

# Terminal 3 - Start Frontend
cd frontend
npm run dev
```

Now navigate to http://localhost:5173/search and you should see bikes loaded from your database!

