import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.usertype) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/patient';
      default:
        return '/login';
    }
  };

  const handleBookAppointment = () => {
    if (user) {
      // If user is logged in, navigate to appropriate page
      if (user.usertype === 'patient') {
        navigate('/patient/hospitals');
      } else {
        navigate(getDashboardPath());
      }
    } else {
      // If not logged in, navigate to signup
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Inspired by Symptomate */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HealthPort</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                About us
              </a>

              {/* Apps Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center py-2">
                  Apps
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                        </svg>
                        <div>
                          <div className="font-medium">iOS App</div>
                          <div className="text-sm text-gray-500">Download on App Store</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                        </svg>
                        <div>
                          <div className="font-medium">Android App</div>
                          <div className="text-sm text-gray-500">Get it on Google Play</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                        </svg>
                        <div>
                          <div className="font-medium">Web App</div>
                          <div className="text-sm text-gray-500">Use in browser</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Services Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center py-2">
                  Services
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    <a href="#services" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="font-medium">Book Appointment</div>
                      <div className="text-sm text-gray-500">Schedule with top doctors</div>
                    </a>
                    <a href="#specialties" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="font-medium">Find Specialists</div>
                      <div className="text-sm text-gray-500">Browse by specialty</div>
                    </a>
                    <a href="#features" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="font-medium">Our Features</div>
                      <div className="text-sm text-gray-500">What we offer</div>
                    </a>
                    <a href="#how-it-works" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="font-medium">How It Works</div>
                      <div className="text-sm text-gray-500">Simple 3-step process</div>
                    </a>
                    <a href="#testimonials" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      <div className="font-medium">Testimonials</div>
                      <div className="text-sm text-gray-500">What patients say</div>
                    </a>
                  </div>
                </div>
              </div>

              <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* CTA Buttons / User Info */}
            <div className="flex items-center space-x-3">
              {user ? (
                /* Logged In State */
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    {/* User Info */}
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.usertype}</p>
                      </div>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Mobile - Logged In */}
                  <div className="md:hidden flex items-center space-x-2">
                    <Link to={getDashboardPath()}>
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                /* Logged Out State */
                <>
                  <Link to="/login" className="hidden sm:block">
                    <button className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" className="hidden sm:block">
                    <button className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      Book Appointment
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="space-y-1">
                <a
                  href="#about"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About us
                </a>

                {/* Apps - Mobile */}
                <div className="px-4 py-2">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Download Apps</div>
                  <div className="space-y-1 ml-4">
                    <a
                      href="#"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      iOS App
                    </a>
                    <a
                      href="#"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Android App
                    </a>
                    <a
                      href="#"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Web App
                    </a>
                  </div>
                </div>

                {/* Services - Mobile */}
                <div className="px-4 py-2">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Services</div>
                  <div className="space-y-1 ml-4">
                    <a
                      href="#services"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Book Appointment
                    </a>
                    <a
                      href="#specialties"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Specialists
                    </a>
                    <a
                      href="#features"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Our Features
                    </a>
                    <a
                      href="#how-it-works"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </a>
                    <a
                      href="#testimonials"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Testimonials
                    </a>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>

                {/* Mobile CTA Buttons / User Section */}
                <div className="px-4 pt-4 space-y-3 border-t border-gray-100">
                  {user ? (
                    /* Logged In - Mobile */
                    <>
                      <div className="py-3">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.usertype}</p>
                          </div>
                        </div>
                      </div>
                      <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          Go to Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-3 text-red-600 border border-red-300 font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    /* Logged Out - Mobile */
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-6 py-3 text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          Book Appointment
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Inspired by Symptomate */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                A healthcare system for <span className="text-primary">patients</span>
              </h1>

              {/* Benefits List with Checkmarks */}
              <ul className="space-y-3 mb-10">
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-lg text-gray-900">Find qualified doctors instantly</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-lg text-gray-900">Book your preferred time slot</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-lg text-gray-900">Get instant confirmation</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-lg text-gray-900">Track your health journey</span>
                </li>
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  Book Appointment
                </button>
                <Link to="/login">
                  <button className="px-8 py-4 bg-white text-primary font-semibold rounded-xl border-2 border-primary hover:bg-blue-50 transition-all w-full sm:w-auto">
                    View Doctors
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Background Decorative Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full opacity-60"></div>

                {/* Main Illustration - Female Character */}
                <div className="relative z-10">
                  <div className="w-80 h-80 flex items-end justify-center">
                    {/* Character Body */}
                    <div className="relative">
                      {/* Body */}
                      <div className="w-48 h-40 bg-gradient-to-br from-blue-600 to-blue-700 rounded-t-full relative">
                        {/* White Lines on Shirt */}
                        <div className="absolute top-12 left-8 right-8">
                          <div className="h-1 w-20 bg-white opacity-40 rotate-45 mb-2"></div>
                          <div className="h-1 w-16 bg-white opacity-40 rotate-45"></div>
                        </div>
                      </div>

                      {/* Head */}
                      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-to-br from-red-400 to-red-500 rounded-full">
                        {/* Ear Ring */}
                        <div className="absolute top-14 -left-2 w-4 h-4 border-4 border-white rounded-full"></div>
                        {/* Hair */}
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-400 rounded-full"></div>
                      </div>

                      {/* Arm */}
                      <div className="absolute top-16 right-0 w-20 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full transform rotate-12 origin-top"></div>
                    </div>
                  </div>
                </div>

                {/* Mobile Mockup Cards */}
                <div className="absolute top-8 -left-12 bg-white rounded-2xl shadow-2xl p-4 w-64 z-20">
                  <div className="bg-primary rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-semibold">Appointments</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <div className="flex-1 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-12 -right-8 bg-white rounded-2xl shadow-2xl p-4 w-56 z-20">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                      <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Consult a doctor</div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About HealthPort</h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            HealthPort is a self-service appointment booking platform made by doctors for
            anyone looking to find qualified healthcare providers, book appointments online, or prepare for a medical consultation.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
            Learn more <a href="#" className="text-primary hover:underline font-medium">about us</a>.
          </p>

          {/* Stats in About Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 text-sm md:text-base">Qualified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-gray-600 text-sm md:text-base">Appointments Booked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600 text-sm md:text-base">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How does it work?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              HealthPort is very easy to use. Start by creating your account and finding the right doctor.
              There's no limit on how many appointments you can book. After that, just select your preferred time slot.
              Once that's done, you'll get instant confirmation about your appointment as well as reminders when it's time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <span className="text-gray-400 mr-2">1.</span>
                    Create your account when you need medical care
                  </h3>
                </div>

                {/* Illustration */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-16 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <span className="text-gray-400 mr-2">2.</span>
                    Select your specialty and find doctors
                  </h3>
                </div>

                {/* Illustration - Mobile mockup */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="w-32 h-44 bg-primary rounded-2xl shadow-xl relative">
                    <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-xl p-2">
                      <div className="text-xs font-semibold text-gray-900 mb-2">Specialties</div>
                      <div className="space-y-1">
                        <div className="h-2 bg-blue-200 rounded"></div>
                        <div className="h-2 bg-blue-300 rounded"></div>
                        <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                        <div className="h-2 bg-blue-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <span className="text-gray-400 mr-2">3.</span>
                    Choose your preferred time slot
                  </h3>
                </div>

                {/* Illustration - Calendar mockup */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="w-32 h-44 bg-primary rounded-2xl shadow-xl relative">
                    <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-xl p-2">
                      <div className="text-xs font-semibold text-gray-900 mb-2">Available Times</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-6 bg-blue-100 rounded text-[8px] flex items-center justify-center">9:00</div>
                        <div className="h-6 bg-blue-100 rounded text-[8px] flex items-center justify-center">10:00</div>
                        <div className="h-6 bg-primary rounded text-[8px] flex items-center justify-center text-white">11:00</div>
                        <div className="h-6 bg-blue-100 rounded text-[8px] flex items-center justify-center">14:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <span className="text-gray-400 mr-2">4.</span>
                    Get confirmation and attend your appointment
                  </h3>
                </div>

                {/* Illustration - Confirmation mockup */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="w-32 h-44 bg-primary rounded-2xl shadow-xl relative">
                    <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-xl p-3 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div className="text-[8px] font-semibold text-gray-900">Confirmed!</div>
                      <div className="mt-2 space-y-1 w-full">
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div id="specialties" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Medical Specialties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find specialized doctors across multiple medical disciplines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Specialty Cards */}
            {[
              { name: 'Cardiology', icon: '❤️' },
              { name: 'Dermatology', icon: '🧴' },
              { name: 'Neurology', icon: '🧠' },
              { name: 'Orthopedics', icon: '🦴' },
              { name: 'Pediatrics', icon: '👶' },
              { name: 'Psychiatry', icon: '🧘' },
              { name: 'Ophthalmology', icon: '👁️' },
              { name: 'ENT', icon: '👂' },
              { name: 'Gynecology', icon: '👩' },
              { name: 'Dentistry', icon: '🦷' },
              { name: 'General', icon: '🏥' },
              { name: 'Surgery', icon: '⚕️' },
            ].map((specialty) => (
              <div
                key={specialty.name}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer border border-gray-100"
              >
                <div className="text-4xl mb-3 text-center">{specialty.icon}</div>
                <div className="text-center text-sm font-medium text-gray-900">{specialty.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who Is This For Section */}
      <div id="services" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Who is this for?</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              HealthPort is designed to serve everyone in the healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Patients */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Patients</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Easy online booking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Browse specialist doctors</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Track your appointments</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Manage health records</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <svg className="w-24 h-24 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            {/* For Doctors */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Doctors</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Manage your schedule</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">View patient information</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Track appointments</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Update availability</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <svg className="w-24 h-24 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.20.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
              </div>
            </div>

            {/* For Admins */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrators</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Full system control</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Manage doctors & staff</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Analytics & reporting</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">System configuration</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <svg className="w-24 h-24 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Inspired by Symptomate */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 - Hours of Medical Expertise */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-3xl p-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">150,000+</div>
                <div className="text-gray-700 text-lg font-medium">hours of doctors' work</div>
              </div>
              <div className="mt-8 flex justify-center">
                {/* Medical consultation illustration */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat 2 - Appointments Performed */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-3xl p-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">25M+</div>
                <div className="text-gray-700 text-lg font-medium">appointments performed</div>
              </div>
              <div className="mt-8 flex justify-center">
                {/* Appointments illustration */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg rotate-6"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/40 rounded-lg -rotate-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary/70" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                      <path d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat 3 - Monthly Growth */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-3xl p-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">200,000+</div>
                <div className="text-gray-700 text-lg font-medium">appointments every month</div>
              </div>
              <div className="mt-8 flex justify-center">
                {/* Growth illustration */}
                <div className="relative w-32 h-32">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24">
                    {/* Animated circles representing growth */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-400 rounded-full opacity-60"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full opacity-70"></div>
                    <div className="absolute top-2 right-0 w-8 h-8 bg-primary rounded-full"></div>
                    <div className="absolute top-0 left-4 w-6 h-6 bg-red-400 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary/60 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read testimonials from thousands of satisfied patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "HealthPort made booking my appointment so easy! Found a great cardiologist and got an appointment within days. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Patient</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a busy professional, I appreciate the convenience of online booking. The platform is intuitive and saves me so much time!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Patient</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Excellent service! I was able to find a pediatrician for my daughter quickly. The whole family uses HealthPort now."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">EP</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Parker</div>
                  <div className="text-sm text-gray-500">Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

          {/* Decorative Icons */}
          <div className="absolute top-12 left-12 w-16 h-16 bg-white/10 rounded-2xl rotate-12 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute bottom-12 right-12 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
            </svg>
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-white font-semibold text-sm">Trusted by 50,000+ Patients</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Take Control of<br />Your Health Journey?
            </h2>

            <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience hassle-free healthcare with HealthPort. Book appointments with top-rated doctors,
              manage your health records, and get instant confirmations—all in one place.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Booking</h3>
                <p className="text-blue-100 text-sm">Book appointments in seconds, 24/7</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Verified Doctors</h3>
                <p className="text-blue-100 text-sm">Only qualified healthcare professionals</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">100% Secure</h3>
                <p className="text-blue-100 text-sm">Your data is encrypted and protected</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBookAppointment}
                className="w-full sm:w-auto px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl text-lg hover:scale-105 transform duration-200 flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>

              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white/10 transition-all text-lg backdrop-blur-sm">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact/Footer Section */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">HealthPort</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your trusted healthcare appointment booking platform. Making healthcare accessible, convenient, and hassle-free for everyone.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span>support@healthport.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span>24/7 Support Available</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 HealthPort. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
