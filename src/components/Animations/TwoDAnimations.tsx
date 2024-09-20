import { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowUpDown,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  Maximize2,
  Zap,
} from "lucide-react";

type Animation = {
  initial?: {
    x?: number;
    y?: number;
    opacity?: number;
    scale?: number;
    rotateY?: number;
    rotate?: number | number[];
  };
  animate: {
    x?: number | number[];
    y?: number | number[];
    opacity?: number;
    scale?: number;
    rotateY?: number;
    rotate?: number | number[];
  };
  exit?: {
    x?: number;
    y?: number;
    opacity?: number;
    scale?: number;
    rotateY?: number;
    rotate?: number | number[];
  };
  transition?: {
    duration?: number;
    type?: string;
    stiffness?: number;
    damping?: number;
  };
  description: string;
};

const TwoDAnimations = () => {
  const [activeAnimation, setActiveAnimation] =
    useState<keyof typeof animations>("slideIn");
  const controls = useAnimation();
  const [customParams, setCustomParams] = useState({
    duration: 1,
    delay: 0,
    repeat: 0,
  });

  const animations: { [key: string]: Animation } = {
    slideIn: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 },
      description: "Slide in from left to right with fade effect",
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      description: "Simple fade in and out effect",
    },
    scaleUp: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      exit: { scale: 0 },
      description: "Scale up from nothing to full size",
    },
    rotate: {
      initial: { rotateY: 0 },
      animate: { rotateY: 360 },
      exit: { rotateY: 0 },
      description: "Full 360-degree rotation",
    },
    bounce: {
      initial: { y: -50 },
      animate: { y: 0 },
      transition: { type: "spring", stiffness: 300, damping: 10 },
      description: "Bouncy spring effect on the y-axis",
    },
    shakeX: {
      animate: { x: [0, -10, 10, -10, 10, 0] },
      transition: { duration: 0.5 },
      description: "Horizontal shaking effect",
    },
    flip: {
      initial: { rotateY: 0 },
      animate: { rotateY: 180 },
      exit: { rotateY: 0 },
      description: "Flip effect on the Y-axis",
    },
    wiggle: {
      animate: { rotate: [0, 5, -5, 5, -5, 0] },
      transition: { duration: 0.5 },
      description: "Wiggle rotation effect",
    },
  };

  const handleAnimationChange = (animationName: keyof typeof animations) => {
    setActiveAnimation(animationName);
    controls.start(animations[animationName].animate);
  };

  const handleCustomAnimation = () => {
    controls.start({
      ...animations[activeAnimation].animate,
      transition: {
        duration: customParams.duration,
        delay: customParams.delay,
        repeat: customParams.repeat,
        repeatType: "reverse",
      },
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300">
          2D Animations Showcase
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Explore various 2D animation techniques powered by Framer Motion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(animations).map((animName) => (
            <Button
              key={animName}
              onClick={() =>
                handleAnimationChange(animName as keyof typeof animations)
              }
              variant={activeAnimation === animName ? "default" : "outline"}
              className="flex items-center justify-center gap-2">
              {animName === "slideIn" && <MoveHorizontal className="w-4 h-4" />}
              {animName === "fadeIn" && <ArrowUpDown className="w-4 h-4" />}
              {animName === "scaleUp" && <Maximize2 className="w-4 h-4" />}
              {animName === "rotate" && <RotateCcw className="w-4 h-4" />}
              {animName === "bounce" && <MoveVertical className="w-4 h-4" />}
              {animName === "shakeX" && <Zap className="w-4 h-4" />}
              {animName === "flip" && <RotateCcw className="w-4 h-4" />}
              {animName === "wiggle" && <Zap className="w-4 h-4" />}
              {animName}
            </Button>
          ))}
        </div>

        <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAnimation}
              className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
              initial={
                animations[activeAnimation].initial
                  ? {
                      ...animations[activeAnimation].initial,
                      rotate: Array.isArray(
                        animations[activeAnimation].initial.rotate
                      )
                        ? animations[activeAnimation].initial.rotate[0]
                        : animations[activeAnimation].initial.rotate,
                    }
                  : {}
              }
              animate={controls}
              exit={animations[activeAnimation].exit || {}}
              transition={
                animations[activeAnimation].transition || { duration: 0.5 }
              }>
              {activeAnimation}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Customize Animation
          </h3>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Duration: {customParams.duration}s
            </label>
            <Slider
              value={[customParams.duration]}
              onValueChange={(value) =>
                setCustomParams({ ...customParams, duration: value[0] })
              }
              max={5}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Delay: {customParams.delay}s
            </label>
            <Slider
              value={[customParams.delay]}
              onValueChange={(value) =>
                setCustomParams({ ...customParams, delay: value[0] })
              }
              max={2}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Repeat: {customParams.repeat}
            </label>
            <Slider
              value={[customParams.repeat]}
              onValueChange={(value) =>
                setCustomParams({ ...customParams, repeat: value[0] })
              }
              max={10}
              step={1}
            />
          </div>
          <Button onClick={handleCustomAnimation} className="w-full">
            Apply Custom Animation
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          {animations[activeAnimation].description}. Experiment with different
          animations and customize their parameters to see how they affect the
          motion.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TwoDAnimations;
