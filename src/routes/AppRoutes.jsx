import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../components";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Pages
import {
  Home,
  Login,
  Profile,
  Messages,
  Search,
  Settings,
  NotFound,
} from "../pages";
import Register from "../pages/auth/Register";
import OTPVerification from "../pages/auth/OTPVerification";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/otp-verification"
        element={
          <PublicRoute>
            <OTPVerification />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="u/:username" element={<Profile />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:conversationId" element={<Messages />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
