import React, { useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';

const PastPapersContent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://chatling.ai/js/embed.js';
    script.async = true;
    script.setAttribute('data-id', '6827638292');
    script.id = 'chatling-embed-script';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-4">
            <FaFileAlt className="text-4xl text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Past Paper {item}</h3>
            <p className="text-gray-600">Year: 202{item}</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastPapersContent;
