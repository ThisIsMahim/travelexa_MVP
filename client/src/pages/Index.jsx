import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";

function Index() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state) => state.users);
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    journeyDate: ''
  });
  const [cities, setCities] = useState([]);
  const [buses, setBuses] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCities();
    fetchPackages();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axiosInstance.get("/api/cities");
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await axiosInstance.get("/api/packages/");
      if (response.data.success) {
        setPackages(response.data.data.slice(0, 6)); // Show only first 6 packages
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setPackagesLoading(false);
    }
  };


  const handleSearch = async () => {
    if (!searchFilters.from || !searchFilters.journeyDate) {
      message.warning("Please select departure point and journey date");
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axiosInstance.post(
        `/api/buses/get?from=${searchFilters.from}&to=${searchFilters.to}&journeyDate=${searchFilters.journeyDate}`
      );
      setBuses(response.data.data);
      setShowResults(true);
      message.success(`Found ${response.data.data.length} buses`);
    } catch (error) {
      message.error("No buses found for your search criteria");
      setBuses([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>A & N Travel and Tours - Discover Your Next Adventure</title>
      </Helmet>
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Company Name */}
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                A & N Travel and Tours
              </h1>
            </div>

            {/* Menu Items */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-orange-500 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}>
                  Home
                </a>
                <Link to="/packages" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-orange-500 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}>
                  Packages
                </Link>
                <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-orange-500 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}>
                  Contact
                </Link>
                <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-orange-500 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}>
                  About Us
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'text-gray-700 hover:text-orange-500' 
                          : 'text-white hover:text-orange-300'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/packages"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Browse Packages
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'text-gray-700 hover:text-orange-500' 
                          : 'text-white hover:text-orange-300'
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className={`p-2 rounded-md transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
            </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              From tropical beaches to mountain peaks, find and book your perfect getaway with exclusive deals and packages.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-fade-in-up-delay bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* From */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Departure Point</label>
                  <select
                  value={searchFilters.from}
                  onChange={(e) => setSearchFilters({...searchFilters, from: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  <option value="">Select departure point</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* To - Dynamic Destination */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Destination</label>
                  <select
                  value={searchFilters.to}
                  onChange={(e) => setSearchFilters({...searchFilters, to: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  <option value="">Select destination</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Journey Date */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Journey Date</label>
                  <input
                  type="date"
                    min={new Date().toISOString().split("T")[0]}
                  value={searchFilters.journeyDate}
                  onChange={(e) => setSearchFilters({...searchFilters, journeyDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Search Button */}
                    <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {searchLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search Boats'
              )}
                    </button>
                  </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {showResults && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Available Boats
              </h2>
              <p className="text-lg text-gray-600">
                {buses.length > 0 
                  ? `Found ${buses.length} boats from ${searchFilters.from} to ${searchFilters.to}`
                  : 'No boats found for your search criteria'
                }
              </p>
            </div>

            {buses.length > 0 ? (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  {buses.map((bus, index) => (
                    <Col key={index} xs={24} sm={24} md={12} lg={24}>
                      <Bus bus={bus} />
                </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚢</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No boats found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or check back later</p>
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Search Again
                </button>
                    </div>
                  )}
                </div>
        </section>
      )}

      {/* Featured Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Travel Packages
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing destinations with our carefully curated travel packages
            </p>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div key={pkg._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  {/* Package Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {pkg.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {pkg.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Package Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    
                    {/* Package Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {pkg.destination}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {pkg.duration} days
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Max {pkg.maxParticipants} people
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-500">${pkg.price}</span>
                        <span className="text-gray-600 text-sm"> per person</span>
                      </div>
                      <button
                        onClick={() => {
                          if (!user) {
                            navigate(`/login?from=${encodeURIComponent(`/package/${pkg._id}`)}`);
                          } else {
                            navigate(`/package/${pkg._id}`);
                          }
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Packages Button */}
          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Packages
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">A & N Travel and Tours</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted partner for unforgettable Sundarbans adventures. 
                We specialize in safe, comfortable, and memorable boat tours to the world's largest mangrove forest.
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>01511296000 / 01511196910</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>anttbd24@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Sundarbans Boat Tours</li>
                <li>Wildlife Viewing</li>
                <li>Mangrove Exploration</li>
                <li>Group Bookings</li>
                <li>Private Tours</li>
              </ul>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400">&copy; 2024 A & N Travel and Tours. All rights reserved.</p>
              </div>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Index;
