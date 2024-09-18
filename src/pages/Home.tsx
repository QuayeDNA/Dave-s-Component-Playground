import { useState, useEffect, ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Paintbrush, Code, Layers, Zap, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface FloatingObjectProps {
  children: ReactNode;
  className: string;
}

const FloatingObject: React.FC<FloatingObjectProps> = ({ children, className }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
);

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <Card className="w-full md:w-64 bg-gray-800 bg-opacity-80 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300 border-gray-700">
    <CardContent className="p-6">
      <Icon className="w-12 h-12 mb-4 text-blue-400" />
      <h3 className="text-lg font-semibold mb-2 text-gray-100">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const DarkBackground: React.FC = () => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-gray-900" />
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFhMWExYSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgMTBMMjQgNTBMMzggNTBMMzYgMTBaIiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-5" />
  </div>
);

const InteractivePlayground: React.FC = () => {
  const [activeColor, setActiveColor] = useState('#61afef');
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ backgroundColor: activeColor });
  }, [activeColor, controls]);

  const colors = ['#61afef', '#c678dd', '#98c379', '#e5c07b'];

  return (
    <div className="mt-12 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold mb-4 text-gray-100">Interactive Playground</h3>
      <motion.div
        animate={controls}
        className="w-full h-32 rounded-md shadow-md mb-4"
      />
      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: color }}
            onClick={() => setActiveColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <DarkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-400 mb-6">
            Component Playground
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Explore, create, and test beautiful React components with ease!
          </p>
          <Button 
            size="lg" 
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => navigate('/overview')}
          >
            Get Started
          </Button>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Paintbrush}
            title="Design Freedom"
            description="Create stunning designs with our flexible component library"
          />
          <FeatureCard
            icon={Code}
            title="TypeScript Ready"
            description="Built with TypeScript for robust, type-safe development"
          />
          <FeatureCard
            icon={Layers}
            title="Composable"
            description="Mix and match components to build complex interfaces"
          />
          <FeatureCard
            icon={Zap}
            title="Performance"
            description="Optimized for speed and efficiency in your projects"
          />
        </div>

        <InteractivePlayground />
      </div>

      <FloatingObject className="top-20 left-10">
        <div className="w-16 h-16 bg-yellow-500 rounded-full opacity-30" />
      </FloatingObject>
      <FloatingObject className="top-40 right-20">
        <div className="w-20 h-20 bg-green-500 rounded-lg opacity-30 rotate-45" />
      </FloatingObject>
      <FloatingObject className="bottom-20 left-1/4">
        <div className="w-24 h-24 bg-blue-500 rounded-full opacity-30" />
      </FloatingObject>
    </div>
  );
};

export default HomePage;