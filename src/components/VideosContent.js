import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const VideosContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 7)}w`;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log('User is not authenticated');
          setLoading(false);
          alert('You must be logged in to view videos.');
          return;
        }

        const q = query(
          collection(db, 'uploads'),
          where('category', '==', 'videos'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const videoData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          const userData = userDoc.data();

          let freshFileURL = '';
          if (data.fileURL) {
            const storage = getStorage();
            const fileRef = ref(storage, data.fileURL);
            freshFileURL = await getDownloadURL(fileRef);
          }

          return {
            id: docSnap.id,
            ...data,
            userName: userData?.displayName || 'Anonymous',
            userProfileImage: userData?.profileImage || '/default-profile.png',
            uploadTime: formatTime(data.createdAt.toDate()),
            fileURL: freshFileURL
          };
        }));
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos: ", error);
        alert("Error fetching videos. Please check your permissions and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow-md p-4">
          {video.fileURL ? (
            <video
              className="w-full h-40 object-cover mb-4 rounded"
              src={video.fileURL}
              controls
              onError={(e) => {
                console.error("Error loading video:", e);
                e.target.onerror = null;
                e.target.src = "/video-placeholder.png";
              }}
            />
          ) : (
            <div className="bg-gray-300 h-40 mb-4 rounded flex items-center justify-center">
              <p>Video unavailable</p>
            </div>
          )}
          <div className="flex items-center mb-2">
            <img
              src={video.userProfileImage}
              alt={`${video.userName}'s profile`}
              className="w-8 h-8 rounded-full mr-2 cursor-pointer"
              onClick={() => handleProfileClick(video.userId)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
            <p className="text-sm text-gray-500">{video.userName}</p>
            <p className="text-sm text-gray-500 ml-auto">{video.uploadTime}</p>
          </div>
          <h3 className="text-lg font-bold">{video.unit || 'Untitled Video'}</h3>
          <p className="text-gray-600 mb-2">
            {video.description
              ? video.description.length > 50
                ? video.description.substring(0, 50) + '...'
                : video.description
              : 'No description available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VideosContent;