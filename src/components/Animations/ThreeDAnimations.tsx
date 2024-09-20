import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Box, Cuboid, Maximize2, MousePointer } from 'lucide-react';

type AnimationParams = {
  animate: object;
  transition: object;
  description: string;
};

const animations: Record<string, AnimationParams> = {
  rotate: {
    animate: { rotateX: 360, rotateY: 360, rotateZ: 360 },
    transition: { duration: 5, repeat: Infinity, ease: "linear" },
    description: "Continuous rotation on all axes"
  },
  flip: {
    animate: { rotateY: 180 },
    transition: { duration: 0.6 },
    description: "180-degree flip on the Y-axis"
  },
  swing: {
    animate: { rotateZ: [0, 15, -15, 15, 0] },
    transition: { duration: 2, repeat: Infinity },
    description: "Swinging motion on the Z-axis"
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1, repeat: Infinity },
    description: "Pulsing scale effect"
  },
  tilt: {
    animate: { rotateX: 30, rotateY: -30 },
    transition: { duration: 0.5 },
    description: "Tilted perspective effect"
  },
  interactive: {
    animate: {}, // Empty object for interactive mode
    transition: { type: "spring", stiffness: 300, damping: 30 },
    description: "Interactive mode - move your mouse over the box"
  }
};

const ThreeDAnimations = () => {
  const [activeAnimation, setActiveAnimation] = useState('rotate');
  const [customParams, setCustomParams] = useState({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 1000,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [45, -45]);
  const rotateY = useTransform(mouseX, [-300, 300], [-45, 45]);

  const handleAnimationChange = (animName: string) => {
    setActiveAnimation(animName);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  };

  const handleSliderChange = (param: string, value: number[]) => {
    setCustomParams(prev => ({ ...prev, [param]: value[0] }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-purple-800 dark:text-purple-300">3D Animations Showcase</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">Explore immersive 3D animation techniques powered by Framer Motion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(animations).map((animName) => (
            <Button
              key={animName}
              onClick={() => handleAnimationChange(animName)}
              variant={activeAnimation === animName ? "default" : "outline"}
              className="flex items-center justify-center gap-2"
            >
              {animName === 'rotate' && <RotateCcw className="w-4 h-4" />}
              {animName === 'flip' && <Box className="w-4 h-4" />}
              {animName === 'swing' && <RotateCcw className="w-4 h-4" />}
              {animName === 'pulse' && <Maximize2 className="w-4 h-4" />}
              {animName === 'tilt' && <Cuboid className="w-4 h-4" />}
              {animName === 'interactive' && <MousePointer className="w-4 h-4" />}
              {animName}
            </Button>
          ))}
        </div>
        
        <div 
          className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden"
          style={{ perspective: `${customParams.perspective}px` }}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAnimation}
              className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
              style={{ 
                rotateX: activeAnimation === 'interactive' ? rotateX : customParams.rotateX,
                rotateY: activeAnimation === 'interactive' ? rotateY : customParams.rotateY,
                rotateZ: customParams.rotateZ,
              }}
              animate={animations[activeAnimation].animate}
              transition={animations[activeAnimation].transition}
            >
              3D Box
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Customize 3D Transform</h3>
          {['rotateX', 'rotateY', 'rotateZ'].map((param) => (
            <div key={param} className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">{param}: {customParams[param as keyof typeof customParams]}°</label>
              <Slider
                value={[customParams[param as keyof typeof customParams]]}
                onValueChange={(value) => handleSliderChange(param, value)}
                min={-180}
                max={180}
                step={1}
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Perspective: {customParams.perspective}px</label>
            <Slider
              value={[customParams.perspective]}
              onValueChange={(value) => handleSliderChange('perspective', value)}
              min={200}
              max={2000}
              step={10}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          {animations[activeAnimation].description}
          {" Experiment with different animations and customize the 3D transform parameters to see how they affect the object in 3D space."}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ThreeDAnimations;