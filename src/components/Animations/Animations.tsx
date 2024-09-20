import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowUpDown, Cuboid, Fingerprint, Layers, Sparkles, Zap } from 'lucide-react';

const AnimationsPlayground = () => {
  const [activeTab, setActiveTab] = useState('2d');
  const [physicsStrength, setPhysicsStrength] = useState(50);

  // 2D Animation
  const twoDVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  // 3D Animation
  const threeDVariants = {
    hover: { rotateY: 180, transition: { duration: 0.5 } },
  };

  // Physics Animation
  const physicsSpring = useSpring(0, {
    stiffness: physicsStrength * 5,
    damping: 10,
  });

  // Tween Animation
  const tweenVariants = {
    start: { scale: 1, rotate: 0 },
    end: { scale: 1.2, rotate: 360, transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
  };

  // Interactive Animation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-90, 90]);
  const bind = useDrag((params) => {
    x.set(params.offset[0]);
  });

  // Morphing Animation
  const morphVariants = {
    circle: { borderRadius: '50%' },
    square: { borderRadius: '0%' },
  };
  const [morphShape, setMorphShape] = useState('circle');

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-purple-800 dark:text-purple-300">Animations Playground</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">Explore various animation techniques powered by Framer Motion</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="2d" className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4" /> 2D</TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2"><Cuboid className="w-4 h-4" /> 3D</TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-2"><Zap className="w-4 h-4" /> Physics</TabsTrigger>
            <TabsTrigger value="tween" className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Tween</TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Interactive</TabsTrigger>
            <TabsTrigger value="morphing" className="flex items-center gap-2"><Layers className="w-4 h-4" /> Morphing</TabsTrigger>
          </TabsList>
          <div className="mt-8 h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <TabsContent value="2d" className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 bg-purple-500 rounded-lg"
                  variants={twoDVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                />
              </TabsContent>
              <TabsContent value="3d" className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 bg-indigo-500 rounded-lg flex items-center justify-center cursor-pointer perspective-1000"
                  whileHover="hover"
                  variants={threeDVariants}
                >
                  <span className="text-white font-bold">3D Hover</span>
                </motion.div>
              </TabsContent>
              <TabsContent value="physics" className="w-full h-full flex flex-col items-center justify-center gap-4">
                <motion.div
                  className="w-16 h-16 bg-green-500 rounded-full"
                  style={{ y: physicsSpring }}
                />
                <Slider
                  value={[physicsStrength]}
                  onValueChange={(value) => {
                    setPhysicsStrength(value[0]);
                    physicsSpring.set(Math.random() * 100 - 50);
                  }}
                  max={100}
                  step={1}
                  className="w-64"
                />
              </TabsContent>
              <TabsContent value="tween" className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 bg-yellow-500 rounded-lg"
                  variants={tweenVariants}
                  initial="start"
                  animate="end"
                />
              </TabsContent>
              <TabsContent value="interactive" className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-64 h-16 bg-red-500 rounded-lg cursor-grab active:cursor-grabbing"
                  style={{ x, rotate }}
                  {...bind()}
                >
                  <span className="flex items-center justify-center h-full text-white font-bold">Drag me!</span>
                </motion.div>
              </TabsContent>
              <TabsContent value="morphing" className="w-full h-full flex flex-col items-center justify-center gap-4">
                <motion.div
                  className="w-32 h-32 bg-blue-500"
                  animate={morphShape}
                  variants={morphVariants}
                />
                <Button onClick={() => setMorphShape(morphShape === 'circle' ? 'square' : 'circle')}>
                  Toggle Shape
                </Button>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Explore different animation techniques by selecting tabs above. Each animation showcases unique capabilities of Framer Motion and other libraries.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AnimationsPlayground;