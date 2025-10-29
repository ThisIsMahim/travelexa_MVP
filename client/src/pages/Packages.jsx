import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import { useSelector } from "react-redux";

function Packages() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    destination: '',
    minPrice: '',
    maxPrice: '',
    difficulty: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const { data } = await axiosInstance.get(`/api/packages?${queryParams}`);
      setPackages(data.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/api/packages/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    fetchPackages();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      destination: '',
      minPrice: '',
      maxPrice: '',
      difficulty: '',
      search: ''
    });
  };

  const handleBookNow = (packageId) => {
    if (!user) {
      // Redirect to login with current path as redirect parameter
      navigate(`/login?from=${encodeURIComponent(`/book-package/${packageId}`)}`);
    } else {
      // Navigate to booking page if authenticated
      navigate(`/book-package/${packageId}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Travel Packages - A & N Travel and Tours</title>
      </Helmet>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                A & N Travel and Tours
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Home
                </Link>
                <Link to="/packages" className="text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                  Packages
                </Link>
                <a href="#contact" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Contact
                </a>
                <a href="#about" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  About Us
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Discover Amazing Packages
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in-up-delay">
            Explore our curated collection of travel packages designed to create unforgettable memories
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>

              {/* Category */}
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <input
                  type="text"
                  placeholder="Destination"
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>

              {/* Price Range */}
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>

              {/* Difficulty */}
              <div>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  <option value="">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Search Packages
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
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
                        {pkg.shortDescription}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-orange-500">
                            ${pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              ${pkg.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">
                            {pkg.rating} ({pkg.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>📍 {pkg.destination}</span>
                        <span>⏱️ {pkg.duration}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/package/${pkg._id}`}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleBookNow(pkg._id)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-center py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {packages.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏔️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                  <button
                    onClick={clearFilters}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">A & N Travel and Tours</h3>
          <div className="text-lg text-gray-300 space-y-2">
            <p>Phone: 01511296000 / 01511196910</p>
            <p>Email: anttbd24@gmail.com</p>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; 2024 A & N Travel and Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Packages;
