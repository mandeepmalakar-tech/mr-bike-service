# Booking System Testing Guide

## Quick Start Testing

### Prerequisites

1. **MongoDB Running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Backend Running:**
   ```bash
   cd backend
   npm install
   npm run dev
   # Should show: "Server is running on port: 8000"
   ```

3. **Frontend Running:**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Should show: "Local: http://localhost:5173"
   ```

## Step-by-Step Testing

### Step 1: Add Sample Bikes to Database

```bash
mongosh mongodb://localhost:27017/mrbike
```

```javascript
db.bikes.insertMany([
  {
    name: "royal enfield classic 350",
    packageCost: 500,
    location: "ina metro, delhi",
    city: "vizag",
    numberOfVehicles: 5,
    imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "ktm duke 390",
    packageCost: 800,
    location: "rk beach, vizag",
    city: "vizag",
    numberOfVehicles: 3,
    imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "yamaha r15 v4",
    packageCost: 700,
    location: "beach road, vizag",
    city: "vizag",
    numberOfVehicles: 4,
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

**Verify:**
```javascript
db.bikes.find().count()
// Should return 3
```

### Step 2: Register a User

1. Go to `http://localhost:5173/register`
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Phone: 9876543210
3. Click "Sign Up"
4. Should redirect to home page

### Step 3: Login

1. Go to `http://localhost:5173/login`
2. Enter:
   - Email: test@example.com
   - Password: Test@123
3. Click "Login"
4. Should redirect to home page

### Step 4: Test Search Flow (ExploreBikes → Search)

1. Go to `http://localhost:5173/explore`
2. Fill in the form:
   - **Pickup Date:** Tomorrow's date
   - **Pickup Time:** 10:00
   - **Return Date:** 5 days from tomorrow
   - **Return Time:** 10:00
   - **City:** Vizag (default)
3. Click "Find Available Bikes"
4. **Expected:** Should redirect to `/search` page with bikes displayed

**Verify:**
- Check browser console for API call: `GET /api/v1/bikes?city=vizag&available=true`
- Should see 3 bikes displayed
- Each bike card should show name, location, price, and "Book Now" button

### Step 5: Test Booking Modal

1. On Search page, click "Book Now" on any bike
2. **Expected:** Modal opens with:
   - Bike image and details
   - Pre-filled dates from search
   - Cost calculation showing

**Test Cases:**

#### TC1: Verify Pre-filled Dates
- Pickup date should match what you entered in Step 4
- Return date should match what you entered in Step 4

#### TC2: Modify Dates
- Change pickup date to tomorrow
- Change return date to 3 days later
- **Expected:** Cost updates automatically
- Example: 3 days × ₹500 = ₹1500

#### TC3: Invalid Dates
- Set return date before pickup date
- Click "Confirm Booking"
- **Expected:** Error message "Return date and time must be after pickup date and time"

#### TC4: Valid Booking
- Set valid dates (return after pickup)
- Verify cost is calculated correctly
- Click "Confirm Booking"
- **Expected:**
  - Success message appears
  - Redirects to `/bookings` page after 2 seconds

### Step 6: Verify Booking in Database

```javascript
// In MongoDB shell
db.bookings.find().pretty()
```

**Expected Output:**
```javascript
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "bike": ObjectId("..."),
  "pickupDate": ISODate("2025-10-05T10:00:00.000Z"),
  "returnDate": ISODate("2025-10-08T10:00:00.000Z"),
  "totalCost": 1500,
  "status": "booked",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**Check Bike Availability:**
```javascript
db.bikes.findOne({ name: "royal enfield classic 350" })
```

**Expected:**
- `numberOfVehicles` should be 4 (was 5 before booking)
- `isAvailable` should still be `true`

### Step 7: Test Bookings Page

1. Go to `http://localhost:5173/bookings`
2. **Expected:** See your booking card with:
   - Bike image
   - Bike name (capitalized)
   - Status badge (Green - "Booked")
   - Pickup date and time
   - Return date and time
   - Duration in days
   - Total cost
   - "Cancel Booking" button

### Step 8: Test Cancellation

1. On Bookings page, click "Cancel Booking"
2. Confirm the dialog
3. **Expected:**
   - Status changes to "Cancelled" (Red badge)
   - "Cancel Booking" button disappears
   - Success alert appears

**Verify in Database:**
```javascript
// Check booking status
db.bookings.find().pretty()
// status should be "cancelled"

// Check bike availability restored
db.bikes.findOne({ name: "royal enfield classic 350" })
// numberOfVehicles should be 5 again
```

### Step 9: Test Multiple Bookings

1. Go back to `/search`
2. Book another bike (different bike)
3. Go to `/bookings`
4. **Expected:** See both bookings
   - First booking: Cancelled (Red)
   - Second booking: Booked (Green)

### Step 10: Test Edge Cases

#### EC1: Book Without Login
1. Logout
2. Go to `/search`
3. Click "Book Now"
4. Fill in dates and confirm
5. **Expected:** Error message "Please login to book a bike"
6. **Expected:** Redirects to `/login` after 2 seconds

#### EC2: Book Last Available Bike
```javascript
// Set bike to have only 1 vehicle
db.bikes.updateOne(
  { name: "royal enfield classic 350" },
  { $set: { numberOfVehicles: 1 } }
)
```

1. Login
2. Book the bike
3. **Expected:** Booking successful
4. **Check Database:**
```javascript
db.bikes.findOne({ name: "royal enfield classic 350" })
// numberOfVehicles: 0
// isAvailable: false
```

5. Try to book the same bike again
6. **Expected:** Error "Bike not available for booking"

#### EC3: Same Pickup and Return Time
1. Open booking modal
2. Set pickup date: 2025-10-05, time: 10:00
3. Set return date: 2025-10-05, time: 10:00
4. Click confirm
5. **Expected:** Error "Return date and time must be after pickup date and time"

#### EC4: Empty Bookings Page
```javascript
// Delete all bookings for test user
db.bookings.deleteMany({ user: ObjectId("YOUR_USER_ID") })
```

1. Go to `/bookings`
2. **Expected:** Empty state with:
   - Calendar icon
   - "No bookings yet" message
   - "Explore Bikes" button

## API Testing with cURL

### Test 1: Get Bikes
```bash
curl http://localhost:8000/api/v1/bikes?city=vizag&available=true
```

**Expected:** JSON with bikes array

### Test 2: Create Booking (requires login first)

```bash
# First, login and save cookies
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Create booking
curl -X POST http://localhost:8000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bike":"BIKE_ID_FROM_DATABASE",
    "pickupDate":"2025-10-05T10:00:00.000Z",
    "returnDate":"2025-10-10T10:00:00.000Z"
  }'
```

### Test 3: Get My Bookings
```bash
curl http://localhost:8000/api/v1/bookings -b cookies.txt
```

### Test 4: Cancel Booking
```bash
curl -X DELETE http://localhost:8000/api/v1/bookings/BOOKING_ID/cancel \
  -b cookies.txt
```

## Performance Testing

### Test 1: Load Time
1. Open DevTools → Network tab
2. Clear cache and hard reload
3. Go to `/search`
4. **Expected:** Page loads in < 2 seconds

### Test 2: API Response Time
1. Open DevTools → Network tab
2. Go to `/search`
3. Click on API call
4. **Expected:** Response time < 500ms

### Test 3: Modal Open/Close
1. Click "Book Now" 10 times rapidly
2. **Expected:** Modal opens and closes smoothly, no lag

## Browser Console Checks

### Check 1: No Errors
1. Open DevTools → Console
2. Navigate through all pages
3. **Expected:** No red errors (warnings are OK)

### Check 2: API Calls
1. Go to `/search`
2. Check console logs:
   ```
   Fetching bikes from backend with params: {city: "vizag", available: "true"}
   Backend response: {success: true, data: {...}}
   Successfully fetched 3 bikes from database
   ```

## Database Verification Commands

```javascript
// Check total bikes
db.bikes.find().count()

// Check available bikes
db.bikes.find({ isAvailable: true }).count()

// Check total bookings
db.bookings.find().count()

// Check active bookings
db.bookings.find({ status: "booked" }).count()

// Check cancelled bookings
db.bookings.find({ status: "cancelled" }).count()

// View all bookings with bike details
db.bookings.aggregate([
  {
    $lookup: {
      from: "bikes",
      localField: "bike",
      foreignField: "_id",
      as: "bikeDetails"
    }
  },
  {
    $unwind: "$bikeDetails"
  }
])
```

## Complete Test Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] MongoDB connected
- [ ] Sample bikes added to database
- [ ] User registered successfully
- [ ] User logged in successfully
- [ ] ExploreBikes form works
- [ ] Search page shows bikes from database
- [ ] Booking modal opens with correct data
- [ ] Dates pre-filled from search
- [ ] Cost calculates correctly
- [ ] Can modify dates in modal
- [ ] Invalid date validation works
- [ ] Booking creates successfully
- [ ] Database updated (booking created, bike count decreased)
- [ ] Redirects to bookings page
- [ ] Bookings page shows all bookings
- [ ] Can cancel booking
- [ ] Database updated (status changed, bike count increased)
- [ ] Cannot book without login
- [ ] Cannot book unavailable bikes
- [ ] Empty bookings state works
- [ ] Multiple bookings display correctly
- [ ] No console errors
- [ ] API calls successful
- [ ] Page loads fast

## Expected Final State

After all tests:

### Database State
```javascript
// 3 bikes (some with decreased counts)
db.bikes.find().count() // 3

// Multiple bookings (some booked, some cancelled)
db.bookings.find().count() // >= 2

// At least 1 user
db.users.find().count() // >= 1
```

### UI State
- Home page shows bikes in slider
- Search page shows available bikes
- Bookings page shows user's bookings
- Profile page shows user info

## Troubleshooting

### Issue: "Cannot connect to backend server"
**Fix:**
```bash
cd backend
npm run dev
```

### Issue: "No bikes showing"
**Fix:**
```javascript
// Add bikes to database
db.bikes.insertMany([...])
```

### Issue: "Booking modal not opening"
**Fix:**
- Check browser console for errors
- Verify BikeCard onBook prop is passed
- Check BookingModal import

### Issue: "Database not updating"
**Fix:**
- Check MongoDB is running
- Verify connection string in backend/.env
- Check backend logs

---

**Testing Complete!** 🎉

If all checkboxes are ticked, your booking system is working perfectly with the database!


