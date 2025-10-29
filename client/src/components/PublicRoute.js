import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only redirect if user is logged in and trying to access login/register pages
    // Allow logged-in users to access all public pages including home page
    if (localStorage.getItem("token") && 
        (location.pathname.includes("/login") || 
         location.pathname.includes("/register") ||
         location.pathname.includes("/forgot-password") ||
         location.pathname.includes("/reset-password") ||
         location.pathname.includes("/email-sent") ||
         location.pathname.includes("/password-reset-success"))) {
      navigate("/dashboard");
    }
  }, [navigate, location.pathname]);
  
  return <div>{children}</div>;
}

export default PublicRoute;
