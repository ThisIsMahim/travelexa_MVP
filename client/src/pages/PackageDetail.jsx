import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/packages/${id}`);
      setPackageData(data.data);
    } catch (error) {
      console.error('Error fetching package details:', error);
      navigate('/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleBookPackage = () => {
    if (!user) {
      // Redirect to login with current path as redirect parameter
      navigate(`/login?from=${encodeURIComponent(`/book-package/${packageData._id}`)}`);
    } else {
      // Navigate to booking page if authenticated
      navigate(`/book-package/${packageData._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <Link
            to="/packages"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{packageData.title} - A & N Travel and Tours</title>
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

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={packageData.images[0]}
            alt={packageData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{packageData.title}</h1>
            <p className="text-xl">{packageData.destination}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Package Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {packageData.category}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {packageData.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {packageData.rating} ({packageData.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{packageData.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">${packageData.price}</div>
                    <div className="text-sm text-gray-600">Per Person</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{packageData.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{packageData.maxGuests}</div>
                    <div className="text-sm text-gray-600">Max Guests</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{packageData.destination}</div>
                    <div className="text-sm text-gray-600">Destination</div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Package Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-orange-500 mt-1">✓</span>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.includes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Not Included */}
              {packageData.excludes && packageData.excludes.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.excludes.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Itinerary</h3>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Day {day.day}: {day.title}
                        </h4>
                        <p className="text-gray-700 mb-3">{day.description}</p>
                        <div className="space-y-1">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-start space-x-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span className="text-gray-600">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best Time to Visit</h4>
                    <p className="text-gray-700">{packageData.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h4>
                    <p className="text-gray-700">{packageData.cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    ${packageData.price}
                  </div>
                  <div className="text-gray-600">per person</div>
                  {packageData.originalPrice && (
                    <div className="text-lg text-gray-500 line-through mt-1">
                      ${packageData.originalPrice}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{packageData.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Guests:</span>
                    <span className="font-medium">{packageData.maxGuests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{packageData.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookPackage}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {user ? 'Book This Package' : 'Login to Book'}
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/packages"
                    className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-300"
                  >
                    ← Back to All Packages
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">📞</span>
                    <span>01511296000 / 01511196910</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">✉️</span>
                    <span>anttbd24@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default PackageDetail;
