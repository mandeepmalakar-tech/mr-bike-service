import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";

// Lazy load components for better performance
import { lazy, Suspense } from "react";

const LazyHome = lazy(() => import("./components/Home.jsx"));
const LazyExploreBikes = lazy(() => import("./components/ExploreBikes.jsx"));
const LazySearch = lazy(() => import("./pages/Search.jsx"));
const LazyLogin = lazy(() => import("./components/Login.jsx"));
const LazySignup = lazy(() => import("./components/Signup.jsx"));
const LazyProfile = lazy(() => import("./components/Profile.jsx"));
const LazyBookings = lazy(() => import("./pages/Bookings.jsx"));
const LazySearchdemo = lazy(() => import("./pages/Searchdemo.jsx"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LazyHome />} />
          <Route path="explore" element={<LazyExploreBikes />} />
          <Route path="search" element={<LazySearch />} />
          <Route path="searchdemo" element={<LazySearchdemo />} />
          <Route path="bikes" element={<LazyExploreBikes />} />
          <Route
            path="bookings"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                }
              >
                <LazyBookings />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                }
              >
                <LazyProfile />
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <h1 className="text-white text-2xl">
                  Notifications Page - Coming Soon
                </h1>
              </div>
            }
          />
          <Route path="login" element={<LazyLogin />} />
          <Route path="register" element={<LazySignup />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <h1 className="text-white text-2xl">404 - Page Not Found</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
