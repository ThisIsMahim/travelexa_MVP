import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AboutUs() {
  const { user } = useSelector((state) => state.users);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us - A & N Travel and Tours</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
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
                  <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-orange-500 ${
                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}>
                    Home
                  </Link>
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
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About A & N Travel and Tours</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Your trusted partner for unforgettable Sundarbans adventures and travel experiences
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Company Story */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  A & N Travel and Tours was founded with a simple yet powerful vision: to make the 
                  breathtaking beauty of the Sundarbans accessible to everyone. What started as a 
                  passion project has grown into one of Bangladesh's most trusted travel companies.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We specialize in providing safe, comfortable, and memorable boat tours to the 
                  Sundarbans, the world's largest mangrove forest and a UNESCO World Heritage Site. 
                  Our experienced team ensures every journey is not just a trip, but an adventure 
                  of a lifetime.
                </p>
                <p className="text-lg text-gray-600">
                  With years of experience in the travel industry, we understand the unique needs 
                  of our guests and are committed to providing exceptional service that exceeds 
                  expectations.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Sundarbans boat tour"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide safe, sustainable, and unforgettable travel experiences to the Sundarbans 
                  while promoting environmental conservation and supporting local communities.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading travel company in Bangladesh, known for our commitment to 
                  excellence, environmental responsibility, and creating lasting memories for our guests.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose A & N Travel and Tours?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We go above and beyond to ensure your Sundarbans experience is nothing short of extraordinary
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-600">
                  All our boats are equipped with modern safety equipment and our crew is trained in emergency procedures.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guides</h3>
                <p className="text-gray-600">
                  Our knowledgeable local guides know every corner of the Sundarbans and will share fascinating insights.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  We offer multiple departure times from both Munshiganj and Khulna to fit your schedule.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Comfortable Boats</h3>
                <p className="text-gray-600">
                  Modern, well-maintained boats with comfortable seating, refreshments, and all necessary amenities.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Expertise</h3>
                <p className="text-gray-600">
                  Deep knowledge of the Sundarbans ecosystem and the best spots for wildlife viewing.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Booking</h3>
                <p className="text-gray-600">
                  Easy online booking with secure payment options and instant confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our dedicated team of professionals is committed to making your Sundarbans journey unforgettable
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">AG</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Akash Ghosh</h3>
                <p className="text-orange-600 font-medium mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Passionate about sustainable tourism and environmental conservation in the Sundarbans.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">AN</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">A & N Team</h3>
                <p className="text-orange-600 font-medium mb-3">Operations Team</p>
                <p className="text-gray-600 text-sm">
                  Experienced professionals ensuring smooth operations and exceptional customer service.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">SG</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sundarbans Guides</h3>
                <p className="text-orange-600 font-medium mb-3">Local Experts</p>
                <p className="text-gray-600 text-sm">
                  Local guides with deep knowledge of the Sundarbans ecosystem and wildlife.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-orange-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-orange-100">Successful Tours</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-orange-100">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-orange-100">Safety Record</div>
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
        </div>
      </div>
    </>
  );
}

export default AboutUs;
