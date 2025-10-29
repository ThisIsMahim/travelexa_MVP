import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);

  const userMenu = [
    {
      name: "Home",
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: "Packages",
      path: "/packages",
      icon: "ri-suitcase-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: "BOATS",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Packages",
      path: "/admin/packages",
      icon: "ri-suitcase-line",
    },
    {
      name: "Package Orders",
      path: "/admin/package-orders",
      icon: "ri-shopping-bag-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Cities",
      path: "/admin/cities",
      icon: "ri-map-pin-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menutoBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/easy-booking";
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Mobile Menu Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        ${collapsed ? 'w-0 lg:w-16' : 'w-64 lg:w-64'} 
        h-screen fixed lg:relative top-0 left-0 z-50 lg:z-auto
        flex flex-col bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
        ${collapsed ? 'lg:px-2' : 'px-4 lg:px-5'} py-0
      `}>
        {/* Mobile Menu Button */}
        <div className="flex flex-col justify-start items-center p-2 lg:p-5">
          <div className="bg-gray-800 w-full flex justify-center lg:justify-start">
            {collapsed ? (
              <i
                className="ri-menu-2-fill cursor-pointer text-2xl lg:text-[30px] text-white"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-line cursor-pointer text-2xl lg:text-[30px] text-white"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-3 lg:gap-5 justify-start mt-8 lg:mt-[100px]">
          {menutoBeRendered.map((item, key) => {
            return (
              <div
                key={key}
                className={`
                  ${activeRoute === item.path && "bg-blue-900 btn-disabled"}
                  gap-2 relative inline-flex items-center justify-start 
                  ${collapsed ? 'px-2 lg:px-3' : 'px-4 lg:px-10'} 
                  py-2 lg:py-3 overflow-hidden font-bold rounded-full group
                  transition-all duration-200
                `}
              >
                <i
                  className={`${item.icon} w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-black opacity-[3%]`}
                ></i>
                <i
                  className={`${item.icon} text-white text-lg lg:text-[20px] group-hover:text-black flex-shrink-0`}
                ></i>

                {!collapsed && (
                  <span
                    onClick={() => {
                      if (item.path === "/logout") {
                        localStorage.clear();
                        navigate("/");
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                    <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-black text-sm lg:text-base">
                      {item.name}
                    </span>
                    <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`
        w-full transition-all duration-300 ease-in-out
        ${collapsed ? 'ml-0 lg:ml-0' : 'ml-64 lg:ml-0'}
      `}>
        {/* Header */}
        <div className="bg-gray-800 flex flex-col lg:flex-row justify-start items-center py-2 px-4">
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="logo"
            className="w-16 h-12 lg:w-30 lg:h-20 rounded-full cursor-pointer mb-2 lg:mb-0"
          />
          <h1 className="text-white text-sm lg:text-base mb-0 p-0 text-center lg:text-left lg:ml-4">
            <div className="mt-1 truncate max-w-xs lg:max-w-none">{user?.name}</div>
            <div className="mt-1 text-xs lg:text-sm text-gray-300 truncate max-w-xs lg:max-w-none">{user?.email}</div>
          </h1>
        </div>
        
        {/* Page Content */}
        <div className="p-2 lg:p-[10px] lg:px-0 min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
