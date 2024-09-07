import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const auth = getAuth();

  useEffect(() => {
    console.log("ProfilePage mounted. userId from params:", userId);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current authenticated user:", user.uid);
      } else {
        console.log("No user is signed in.");
      }
    });

    const fetchUserProfile = async () => {
      try {
        console.log("Attempting to fetch user profile for userId:", userId);
        const userDocRef = doc(db, 'users', userId);
        console.log("User document reference:", userDocRef);
        
        const userDoc = await getDoc(userDocRef);
        console.log("Fetched user document:", userDoc);

        if (userDoc.exists()) {
          console.log("User document data:", userDoc.data());
          setUserProfile(userDoc.data());
        } else {
          console.log('No such user found in Firestore');
          setError('User not found in the database');
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
        setError(`Error loading profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      console.log('No userId provided in URL parameters');
      setError('Invalid user ID');
      setLoading(false);
    }

    return () => unsubscribe();
  }, [userId, auth]);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">User profile not available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-4">
          <img 
            className="h-24 w-24 rounded-full"
            src={userProfile.profileImage || '/default-profile.png'}
            alt="Profile"
          />
          <div>
            <h2 className="text-2xl font-bold">{userProfile.displayName || 'Anonymous'}</h2>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          <p>{userProfile.bio || 'No bio available'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;