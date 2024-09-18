import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Code, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({
  icon: Icon,
  title,
  description,
}) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Icon className="w-6 h-6 text-blue-400" />
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const Overview: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-100 mb-6">Welcome to the Component Playground</h1>
        <p className="text-xl text-gray-300 mb-8">
          Explore, create, and test beautiful React components with ease. Our playground provides a robust environment for component development and experimentation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={Box}
          title="Component Library"
          description="Access a wide range of pre-built components to jumpstart your development."
        />
        <FeatureCard
          icon={Code}
          title="Live Editing"
          description="Edit components in real-time and see instant updates in the preview pane."
        />
        <FeatureCard
          icon={Layers}
          title="Composition Tools"
          description="Easily compose complex UIs by combining and nesting components."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Get Started</h2>
        <p className="text-gray-300 mb-6">
          Ready to dive in? Check out our Zone Management System or explore other components in the playground.
        </p>
        <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
          Explore Zones <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Overview;