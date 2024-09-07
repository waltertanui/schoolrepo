import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">School Repo</span>
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</Link>
              <Link to="/signup" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20" style={{background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"}}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-2 text-white">
            Welcome to School Repo
          </h2>
          <h3 className="text-2xl mb-8 text-gray-200">
            Access tailored learning materials from your institution
          </h3>
          <button className="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-gray-200 transition duration-300">
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Features
        </h2>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Video Lectures</h3>
              <p className="text-gray-600">Access high-quality video lectures tailored to your syllabus.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Study Notes</h3>
              <p className="text-gray-600">Comprehensive notes to help you excel in your studies.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Past Papers</h3>
              <p className="text-gray-600">Practice with past exam papers to prepare for your assessments.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-200">
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Ready to enhance your learning?
          </h2>
          <div className="flex justify-center">
            <Link to="/signup" className="bg-green-500 font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-green-400 transition duration-300 text-white">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">School Repo</h2>
              <p className="mt-2">© 2024 School Repo. All rights reserved.</p>
            </div>
            <div>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-gray-400">About</a></li>
                <li><a href="#" className="hover:text-gray-400">Contact</a></li>
                <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;