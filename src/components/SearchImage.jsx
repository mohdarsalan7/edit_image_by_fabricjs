import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchImage = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  const handleInput = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search`, {
        params: { query, per_page: 12 },
        headers: { Authorization: API_KEY },
      });
      setImages(
        response.data.photos.map((photo) => ({
          src: photo.src.medium,
          alt: photo.alt,
        })),
      );
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(
        'Failed to fetch images. Please check your API key and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openEditor = (url) => {
    navigate('/editor', { state: { imgUrl: url } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleInput} className="flex gap-2">
          <input
            type="text"
            placeholder="Search for images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-pulse">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform 
                ${
                  selectedImage === index
                    ? 'scale-105 ring-4 ring-blue-500'
                    : 'hover:scale-105'
                }
              `}
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-square">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditor(image.src);
                      }}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-110"
                    >
                      Add Captions
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-12 text-gray-500 animate-fade-in">
            No images found. Try searching again.
          </div>
        )
      )}
    </div>
  );
};

export default SearchImage;
