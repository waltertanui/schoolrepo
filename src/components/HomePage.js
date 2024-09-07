

import React, { useState, useEffect } from 'react';
import { FaVideo, FaFileAlt, FaStickyNote, FaUser, FaSignOutAlt, FaUpload, FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; // Adjust the path as needed
import { signOut } from 'firebase/auth';
import VideosContent from './VideosContent';
import PastPapersContent from './PastPapersCotent';
import NotesContent from './NotesContent';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleProfileClick = () => {
    if (currentUserId) {
      navigate(`/profile/${currentUserId}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return <VideosContent />;
      case 'pastPapers':
        return <PastPapersContent />;
      case 'notes':
        return <NotesContent />;
      default:
        return <VideosContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">School Repo</h1>
              </div>
            </div>
            <div className="flex items-center">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaSearch />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="mt-4">
          <nav className="mt-4">
  <a
    className={`flex items-center py-2 px-4 cursor-pointer ${activeTab === 'pastPapers' ? 'bg-gray-200' : ''}`}
    onClick={() => setActiveTab('pastPapers')}
  >
    <FaFileAlt className="mr-3 text-gray-600" />
    <span className="text-gray-700">Past Papers</span>
  </a>

  <a
    className={`flex items-center py-2 px-4 cursor-pointer ${activeTab === 'videos' ? 'bg-gray-200' : ''}`}
    onClick={() => setActiveTab('videos')}
  >
    <FaVideo className="mr-3 text-gray-600" />
    <span className="text-gray-700">Videos</span>
  </a>

  <a
    className={`flex items-center py-2 px-4 cursor-pointer ${activeTab === 'notes' ? 'bg-gray-200' : ''}`}
    onClick={() => setActiveTab('notes')}
  >
    <FaStickyNote className="mr-3 text-gray-600" />
    <span className="text-gray-700">Notes</span>
  </a>

  <Link to="/upload" className="flex items-center py-2 px-4 cursor-pointer">
    <FaUpload className="mr-3 text-gray-600" />
    <span className="text-gray-700">Upload</span>
  </Link>
</nav>

          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <a onClick={handleProfileClick} className="flex items-center py-2 px-4 cursor-pointer">
              <FaUser className="mr-3 text-gray-600" />
              <span className="text-gray-700">Profile</span>
            </a>
            <a onClick={handleSignOut} className="flex items-center py-2 px-4 cursor-pointer">
              <FaSignOutAlt className="mr-3 text-gray-600" />
              <span className="text-gray-700">Sign Out</span>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;