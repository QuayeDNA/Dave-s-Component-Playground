import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, RotateCcw, Pause, PlayCircle } from 'lucide-react';

const TweenAnimations = () => {
  const [duration, setDuration] = useState(1);
  const [easing, setEasing] = useState("easeInOut");
  const [shape, setShape] = useState("square");
  const [color, setColor] = useState("#3b82f6");
  const [isPlaying, setIsPlaying] = useState(true);
  const controls = useAnimation();

  const easingFunctions = ["easeInOut", "easeIn", "easeOut", "linear", "circIn", "circOut", "backIn", "backOut", "anticipate", "bounceIn", "bounceOut"];

  const startAnimation = () => {
    controls.start({
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: shape === "circle" ? ["50%", "50%", "50%", "50%", "50%"] : ["20%", "20%", "50%", "50%", "20%"],
      backgroundColor: [color, color, color, color, color],
      transition: { duration, ease: easing, times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity }
    });
  };

  const pauseAnimation = () => {
    controls.stop();
  };

  const resetAnimation = () => {
    controls.set({ scale: 1, rotate: 0, borderRadius: shape === "circle" ? "50%" : "20%", backgroundColor: color });
    if (isPlaying) startAnimation();
  };

  const randomizeProperties = () => {
    setDuration(Math.random() * 4.5 + 0.5);
    setEasing(easingFunctions[Math.floor(Math.random() * easingFunctions.length)]);
    setShape(Math.random() > 0.5 ? "square" : "circle");
    setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  };

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      pauseAnimation();
    }
  }, [duration, easing, shape, color, isPlaying]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-orange-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-yellow-800 dark:text-yellow-300">Enhanced Tween Animations</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">Explore advanced tween-based animations with various parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden">
          <motion.div
            className="w-32 h-32"
            style={{ backgroundColor: color }}
            animate={controls}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Duration: {duration.toFixed(1)}s</label>
            <Slider
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Easing Function</label>
            <Select value={easing} onValueChange={setEasing}>
              <SelectTrigger>
                <SelectValue placeholder="Select an easing function" />
              </SelectTrigger>
              <SelectContent>
                {easingFunctions.map((func) => (
                  <SelectItem key={func} value={func}>{func}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Shape</label>
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={resetAnimation}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={randomizeProperties}>
            <Shuffle className="mr-2 h-4 w-4" />
            Randomize
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Adjust duration, easing function, shape, and color to create unique animations. 
          Use play/pause and reset controls for more interaction. Try the randomize button for surprising combinations!
        </p>
      </CardFooter>
    </Card>
  );
};

export default TweenAnimations;