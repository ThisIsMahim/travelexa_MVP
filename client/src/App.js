import React, { lazy, Suspense } from "react";
import "./index.css";
import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthInitializer from "./components/AuthInitializer";
import { useSelector } from "react-redux";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminBookings = lazy(() => import("./pages/Admin/AdminBookings"));
const AdminBuses = lazy(() => import("./pages/Admin/AdminBuses"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminPackages = lazy(() => import("./pages/Admin/AdminPackages"));
const AdminPackageOrders = lazy(() => import("./pages/Admin/AdminPackageOrders"));
const Home = lazy(() => import("./pages/Home"));
const BookNow = lazy(() => import("./pages/BookNow"));
const BookPackage = lazy(() => import("./pages/BookPackage"));
const BookHouseboat = lazy(() => import("./pages/BookHouseboat"));
const Bookings = lazy(() => import("./pages/Bookings"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const EmailSent = lazy(() => import("./pages/EmailSent"));
const PasswordResetSuccess = lazy(() => import("./pages/PasswordResetSuccess"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("./pages/PaymentFail"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const Packages = lazy(() => import("./pages/Packages"));
const PackageDetail = lazy(() => import("./pages/PackageDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const AdminCities = lazy(() => import("./pages/Admin/AdminCities"));

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div className="App">
      {loading && <Loader />}
      <BrowserRouter>
        <AuthInitializer>
          <Suspense fallback={loading}>
            <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Index />
                </PublicRoute>
              }
            />

            <Route
              path="/packages"
              element={
                <PublicRoute>
                  <Packages />
                </PublicRoute>
              }
            />

            <Route
              path="/package/:id"
              element={
                <PublicRoute>
                  <PackageDetail />
                </PublicRoute>
              }
            />

            <Route
              path="/contact"
              element={
                <PublicRoute>
                  <Contact />
                </PublicRoute>
              }
            />

            <Route
              path="/about"
              element={
                <PublicRoute>
                  <AboutUs />
                </PublicRoute>
              }
            />

            <Route
              path="/password-reset-success"
              element={
                <PublicRoute>
                  <PasswordResetSuccess />
                </PublicRoute>
              }
            />

            <Route
              path="/email-sent"
              element={
                <PublicRoute>
                  <EmailSent />
                </PublicRoute>
              }
            />

            <Route
              path="/reset-password/:userId/:resetString"
              element={
                <PublicRoute>
                  <UpdatePassword />
                </PublicRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/easy-booking"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-now/:id"
              element={
                <ProtectedRoute>
                  <BookNow />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect /book-now without ID to home */}
            <Route
              path="/book-now"
              element={
                <ProtectedRoute>
                  <BookNow />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-package/:id"
              element={
                <ProtectedRoute>
                  <BookPackage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-houseboat/:id"
              element={
                <ProtectedRoute>
                  <BookHouseboat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/buses"
              element={
                <ProtectedRoute>
                  <AdminBuses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute>
                  <AdminPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/package-orders"
              element={
                <ProtectedRoute>
                  <AdminPackageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cities"
              element={
                <ProtectedRoute>
                  <AdminCities />
                </ProtectedRoute>
              }
            />

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

            {/* Payment Routes */}
            <Route
              path="/payment/success"
              element={
                <PublicRoute>
                  <PaymentSuccess />
                </PublicRoute>
              }
            />
            <Route
              path="/payment/fail"
              element={
                <PublicRoute>
                  <PaymentFail />
                </PublicRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <PublicRoute>
                  <PaymentCancel />
                </PublicRoute>
              }
            />
            </Routes>
          </Suspense>
        </AuthInitializer>
      </BrowserRouter>
    </div>
  );
}

export default App;
