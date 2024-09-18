import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-blue-400 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-100 mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => navigate('/')}
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Home className="mr-2 h-4 w-4" /> Go Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;