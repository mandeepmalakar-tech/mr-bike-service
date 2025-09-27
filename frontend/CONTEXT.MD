# MR-BIKE Frontend Development Context

## Project Overview
Building a modern bike rental website using MERN stack with a clean, simple UI using Shadcn UI and Tailwind CSS. The frontend should be built with Vite + React (JSX) - NO TypeScript or Next.js.

## Backend API Structure

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/logout` - User logout (requires auth)
- `POST /users/refresh-token` - Refresh access token
- `GET /users/profile` - Get user profile (requires auth)
- `PATCH /users/update-profile` - Update user profile (requires auth)

### Bike Endpoints
- `GET /bikes` - Get all bikes (with filters: city, available, sort, page, limit)
- `GET /bikes/:bikeId` - Get bike by ID
- `GET /bikes/city/:city` - Get bikes by city
- `POST /bikes` - Create bike (admin only)
- `PATCH /bikes/:bikeId` - Update bike (admin only)
- `DELETE /bikes/:bikeId` - Delete bike (admin only)

### Booking Endpoints
- `POST /bookings` - Create booking (requires auth)
- `GET /bookings` - Get user's bookings (requires auth)
- `DELETE /bookings/:bookingId/cancel` - Cancel booking (requires auth)
- `GET /bookings/all-bookings` - Get all bookings (admin only)
- `POST /bookings/:bookingId/complete` - Complete booking (admin only)

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  drivingLicense: Boolean,
  password: String (hashed),
  role: "user" | "admin",
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Bike Model
```javascript
{
  _id: ObjectId,
  name: String,
  packageCost: Number,
  location: String,
  city: String,
  numberOfVehicles: Number,
  imageUrl: String,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  bike: ObjectId (ref: Bike),
  pickupDate: Date,
  returnDate: Date,
  totalCost: Number,
  status: "booked" | "cancelled" | "completed",
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Features & User Flow

### USER PART

#### 1. Landing/Search Page
**Route:** `/`
**Components needed:**
- Hero section with "Explore with Rentnhop Ride" title
- Search form with:
  - Vehicle type selector (All, Bike, Car) - segmented control
  - City input field with location icon
  - Pickup date/time picker
  - Return date/time picker with duration display
  - Search button
- Clean, modern design with blue accents

#### 2. Search Results Page
**Route:** `/search`
**Components needed:**
- Search filters bar (pickup/return dates, duration display)
- Results header showing count
- Bike cards grid with:
  - Bike image
  - Bike name and rating
  - Tags (Pay at Pickup, Gearless, Hotseller, etc.)
  - Key details (Trip limit, Security Deposit, Location timings)
  - Price and "Book Now" button
  - Location selector dropdown
- Pagination

#### 3. Bike Details Page
**Route:** `/bike/:bikeId`
**Components needed:**
- Left section:
  - Bike name and brand
  - Rating and trip count
  - Feature tags
  - Large bike image
  - Vehicle specifications grid (Engine, Seating, Transmission, etc.)
- Right section:
  - Date/time display (pickup/return)
  - Package selection
  - Cost breakdown
  - Location details
  - Vehicle quantity selector
  - Total cost and "Add to Cart" button

#### 4. User Authentication
**Routes:** `/login`, `/register`
**Components needed:**
- Login form (email, password)
- Register form (name, email, password)
- Form validation
- Auth state management

#### 5. User Dashboard
**Route:** `/dashboard`
**Components needed:**
- User profile section
- My bookings list
- Booking status management

### ADMIN PART

#### 6. Admin Dashboard
**Route:** `/admin`
**Components needed:**
- Admin navigation
- Booking management table
- Bike management
- User management
- Statistics overview

#### 7. Admin Booking Management
**Route:** `/admin/bookings`
**Components needed:**
- Bookings table with filters
- Status update buttons
- User and bike details
- Telegram notification integration

## UI/UX Requirements

### Design System
- **Primary Color:** Blue (#3B82F6 or similar)
- **Secondary Colors:** Light blue, gray tones
- **Typography:** Clean sans-serif font
- **Components:** Shadcn UI components
- **Styling:** Tailwind CSS
- **Icons:** Lucide React icons

### Key UI Elements
1. **Segmented Control** for vehicle type selection
2. **Date/Time Pickers** with calendar icons
3. **Card Components** for bike listings
4. **Modal/Dialog** for booking confirmation
5. **Table Components** for admin dashboard
6. **Form Components** with validation
7. **Button Variants** (primary, secondary, outline)
8. **Badge/Tag Components** for bike features
9. **Progress Indicators** for booking status
10. **Toast Notifications** for user feedback

## Technical Requirements

### Tech Stack
- **Framework:** React 18+ with Vite
- **Language:** JavaScript (JSX) - NO TypeScript
- **UI Library:** Shadcn UI
- **Styling:** Tailwind CSS
- **State Management:** React Context + useReducer or Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Form Handling:** React Hook Form
- **Date Handling:** date-fns or dayjs
- **Icons:** Lucide React

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/ (Shadcn components)
│   │   ├── forms/
│   │   ├── layout/
│   │   └── features/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── services/
│   └── assets/
├── public/
└── package.json
```

### Key Features to Implement

#### Authentication
- JWT token management
- Protected routes
- Auto token refresh
- User context provider

#### Search & Filtering
- City-based bike search
- Date range validation
- Real-time availability check
- Sort and filter options

#### Booking System
- Date/time validation
- Cost calculation
- Booking confirmation
- Status tracking

#### Admin Features
- Role-based access control
- Booking management
- Bike inventory management
- Telegram notifications

### API Integration Patterns

#### HTTP Client Setup
```javascript
// Axios instance with interceptors
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true
});
```

#### Authentication Headers
```javascript
// Auto-attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Error Handling
- Global error boundary
- API error handling
- User-friendly error messages
- Loading states

### State Management

#### Context Providers Needed
1. **AuthContext** - User authentication state
2. **BookingContext** - Booking management
3. **BikeContext** - Bike data and filters
4. **AdminContext** - Admin dashboard state

### Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly interactions
- Optimized images

### Performance Considerations
- Lazy loading for routes
- Image optimization
- API response caching
- Bundle size optimization

## Development Workflow

### Phase 1: Core Setup
1. Vite + React setup
2. Shadcn UI installation
3. Tailwind CSS configuration
4. Routing setup
5. Basic layout components

### Phase 2: Authentication
1. Login/Register pages
2. Auth context and hooks
3. Protected routes
4. Token management

### Phase 3: User Features
1. Landing page with search
2. Search results page
3. Bike details page
4. Booking flow

### Phase 4: Admin Features
1. Admin dashboard
2. Booking management
3. Bike management
4. Telegram integration

### Phase 5: Polish
1. Error handling
2. Loading states
3. Form validation
4. Responsive design
5. Testing

## Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id
```

## Dependencies to Install
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "react-hook-form": "^7.43.0",
    "date-fns": "^2.29.0",
    "lucide-react": "^0.263.0",
    "zustand": "^4.3.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^1.2.0",
    "tailwind-merge": "^1.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Success Criteria
- Clean, modern UI matching the provided designs
- Smooth user experience for bike search and booking
- Responsive design across all devices
- Proper error handling and loading states
- Admin dashboard for booking management
- Integration with backend API
- Telegram notifications for new bookings
