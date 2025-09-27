# Environment Setup for Mr Bikes Frontend

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here
```

## Backend Connection

The frontend is configured to connect to your backend API running on port 5000. Make sure your backend is running before starting the frontend.

### Backend Requirements:
- MongoDB connection
- Backend server running on port 5000
- CORS enabled for frontend origin

## Quick Start

1. **Start Backend:**
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000

## API Endpoints

The frontend will automatically connect to these backend endpoints:

- `GET /bikes` - Get all bikes
- `GET /bikes/:id` - Get bike by ID
- `GET /bikes/city/:city` - Get bikes by city
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /bookings` - Create booking

## Testing Connection

The home page includes an API test component that will show:
- ✅ Backend connected successfully! (if connection works)
- ❌ Backend connection failed (if there are issues)

## Troubleshooting

1. **Backend not running:** Make sure the backend server is running on port 5000
2. **CORS issues:** Ensure your backend has CORS enabled for the frontend origin
3. **Database connection:** Make sure MongoDB is running and connected
4. **Environment variables:** Check that all required environment variables are set

## Development Notes

- The frontend uses Vite for fast development
- Hot reload is enabled for instant updates
- All API calls are handled through the centralized API service
- Authentication tokens are automatically managed
- Error handling is built into all API calls
