export const CanvasOverlay = ({ isLoading, hasError, onRetry }) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your image...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-sm">
          <p className="text-red-600 font-medium">Oops! Loading failed</p>
          <p className="text-gray-600 mt-2">
            We couldn't load your image. Please try another one.
          </p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Choose Another Image
          </button>
        </div>
      </div>
    );
  }

  return null;
};
