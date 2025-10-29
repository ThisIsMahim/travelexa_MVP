import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "./DefaultLayout";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    
    // If no token or user ID, redirect to login
    if (!token || !userId) {
      navigate("/login");
      return;
    }
    
    // If token exists but no user in state, wait for AuthInitializer to load user
    // This prevents unnecessary redirects while user data is being fetched
  }, [navigate, user]);

  // Show loading while user data is being fetched
  if (localStorage.getItem("token") && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If no user after token check, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}

export default ProtectedRoute;
