import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl sm:text-7xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl sm:text-2xl text-gray-600 mb-6">
        Oops! Page not found
      </p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        <ArrowLeft className="h-5 w-5" />
        Go Back Home
      </button>
    </div>
  );
}

export default NotFoundPage;
