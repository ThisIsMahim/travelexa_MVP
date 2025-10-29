import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import moment from "moment";

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full bg-white flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Journey Date Header */}
        <div className="flex flex-row items-center bg-gray-100 p-3 lg:p-4">
          <img className="h-8 w-8 lg:h-10 lg:w-10 rounded-full mr-3 lg:mr-4 flex-shrink-0" src={logo} alt="Logo" />
          <div className="flex flex-col sm:flex-row sm:items-center">
            <h1 className="text-sm lg:text-base uppercase font-bold text-gray-800">Journey Date</h1>
            <p className="text-sm lg:text-base font-medium text-gray-600 ml-0 sm:ml-2">{bus.journeyDate}</p>
          </div>
        </div>
        
        {/* Bus Information */}
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
            {/* Bus Name */}
            <div className="mb-4 lg:mb-0">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800">{bus.name}</h2>
            </div>
            
            {/* Route Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8">
              {/* Departure */}
              <div className="flex flex-col">
                <p className="text-sm lg:text-base font-bold text-gray-700 mb-1">Departure</p>
                <p className="text-sm lg:text-base font-medium text-gray-600 mb-2">
                  {moment(bus.departure, "HH:mm").format("hh:mm A")}
                </p>
                <p className="text-sm lg:text-base font-bold text-gray-700">From</p>
                <p className="text-sm lg:text-base text-gray-600">{bus.from}</p>
              </div>
              
              {/* Arrival */}
              <div className="flex flex-col">
                <p className="text-sm lg:text-base font-bold text-gray-700 mb-1">Arrival</p>
                <p className="text-sm lg:text-base font-medium text-gray-600 mb-2">
                  {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                </p>
                <p className="text-sm lg:text-base font-bold text-gray-700">To</p>
                <p className="text-sm lg:text-base text-gray-600">{bus.to}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Price and Book Button */}
        <div className="bg-gray-50 flex flex-col sm:flex-row justify-between items-center p-4 lg:p-6 gap-4">
          {/* Price */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
            <div className="flex flex-col">
              <p className="text-sm lg:text-base font-bold text-gray-800">Price</p>
              <p className="text-lg lg:text-xl font-bold text-blue-600">{bus.price} DH</p>
            </div>
          </div>
          
          {/* Book Button */}
          <button
            className="relative inline-flex items-center justify-start
              px-6 lg:px-10 py-2 lg:py-3 overflow-hidden font-bold rounded-full
              group w-full sm:w-auto"
            onClick={() => {
              if (localStorage.getItem("user_id")) {
                navigate(`/book-now/${bus._id}`);
              } else {
                navigate(`/login?from=${encodeURIComponent(`/book-now/${bus._id}`)}`);
              }
              // clear local storage
              localStorage.removeItem("idTrip");
              // set id trip local storage
              localStorage.setItem("idTrip", bus._id);
            }}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white text-sm lg:text-base">
              Book Now
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Bus;
