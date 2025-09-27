# MR-BIKE Frontend

A modern bike rental website built with React, Vite, Shadcn UI, and Tailwind CSS.

## 🚀 Features

### User Features
- **Landing Page**: Clean search interface with vehicle type selection
- **Search & Filter**: City-based bike search with date/time filters
- **Bike Details**: Detailed bike information with booking flow
- **User Authentication**: Login/Register with JWT tokens
- **Dashboard**: User profile and booking management
- **Responsive Design**: Mobile-first approach

### Admin Features
- **Admin Dashboard**: Booking and bike management
- **Booking Management**: View and update booking status
- **Telegram Notifications**: Real-time booking alerts
- **Role-based Access**: Secure admin routes

## 🛠️ Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: JavaScript (JSX) - NO TypeScript
- **UI Library**: Shadcn UI components
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── features/           # Feature-specific components
│   ├── pages/                  # Page components
│   │   └── admin/              # Admin pages
│   ├── hooks/                  # Custom React hooks
│   ├── context/                # React Context providers
│   ├── utils/                  # Utility functions
│   ├── services/               # API services
│   └── assets/                 # Static assets
├── public/                     # Public assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token
   VITE_TELEGRAM_CHAT_ID=your_chat_id
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Tailwind CSS
- Custom theme with CSS variables
- Dark mode support
- Responsive breakpoints
- Custom animations

### Shadcn UI
- Pre-configured components
- Consistent design system
- Accessible components
- Customizable variants

### API Integration
- Axios instance with interceptors
- Automatic token refresh
- Error handling
- Request/response logging

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page with search
- `/search` - Search results
- `/bike/:bikeId` - Bike details
- `/login` - User login
- `/register` - User registration

### Protected Routes
- `/dashboard` - User dashboard
- `/admin` - Admin dashboard
- `/admin/bookings` - Booking management

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Light blue, gray tones
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

### Typography
- **Font**: Inter (system font fallback)
- **Headings**: Bold, various sizes
- **Body**: Regular, readable sizes

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Cards**: Consistent spacing and shadows
- **Forms**: Accessible inputs with validation
- **Navigation**: Responsive header/footer

## 🔐 Authentication

### Features
- JWT token management
- Automatic token refresh
- Protected routes
- Role-based access (user/admin)
- Persistent login state

### User Flow
1. Register/Login with email/password
2. Tokens stored in localStorage
3. Automatic token refresh on API calls
4. Logout clears all tokens

## 📊 State Management

### Context Providers
- **AuthContext**: User authentication state
- **BookingContext**: Booking management
- **BikeContext**: Bike data and filters
- **AdminContext**: Admin dashboard state

### State Structure
```javascript
// Auth State
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}

// Booking State
{
  bookings: Booking[],
  currentBooking: Booking | null,
  isLoading: boolean,
  error: string | null
}
```

## 🚀 Deployment

### Build Process
1. **Production Build**
   ```bash
   npm run build
   ```

2. **Preview Build**
   ```bash
   npm run preview
   ```

### Environment Variables
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_TELEGRAM_BOT_TOKEN`: Telegram bot token
- `VITE_TELEGRAM_CHAT_ID`: Telegram chat ID

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Build optimization enabled
- [ ] Error tracking configured
- [ ] Analytics setup

## 🧪 Development

### Code Quality
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Component documentation

### Best Practices
- Component composition
- Custom hooks for logic
- Error boundaries
- Loading states
- Responsive design

## 📈 Performance

### Optimizations
- Lazy loading for routes
- Image optimization
- Bundle splitting
- API response caching
- Memoization for expensive operations

### Monitoring
- Bundle size analysis
- Performance metrics
- Error tracking
- User analytics

## 🤝 Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is part of the MR-BIKE bike rental platform.

---

**Built with ❤️ using React, Vite, and Shadcn UI**