import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Circle, Square, Triangle, Hexagon, Star, Play, Pause, RotateCcw } from 'lucide-react';

const shapes = {
  circle: "M50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10",
  square: "M10 10 L90 10 L90 90 L10 90 Z",
  triangle: "M50 10 L90 90 L10 90 Z",
  hexagon: "M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z",
  star: "M50 10 L61 40 L94 40 L69 60 L79 90 L50 73 L21 90 L31 60 L6 40 L39 40 Z"
};

const MorphAnimation = () => {
  const [currentShape, setCurrentShape] = useState('circle');
  const [nextShape, setNextShape] = useState('square');
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(2);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            const current = nextShape;
            let next = Object.keys(shapes)[Math.floor(Math.random() * Object.keys(shapes).length)];
            while (next === current) {
              next = Object.keys(shapes)[Math.floor(Math.random() * Object.keys(shapes).length)];
            }
            setCurrentShape(current);
            setNextShape(next);
            return 0;
          }
          return prevProgress + (100 / (duration * 60));
        });
      }, 1000 / 60); // 60 FPS
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, nextShape, autoPlay]);

  const handleShapeChange = (shape: string, isNext: boolean) => {
    if (isNext) {
      setNextShape(shape);
    } else {
      setCurrentShape(shape);
      setProgress(0);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
    setIsPlaying(false);
  };

  const interpolate = (start: string, end: string, progress: number) => {
    const startParts = start.split(' ');
    const endParts = end.split(' ');
    return startParts.map((startPart, index) => {
      const endPart = endParts[index];
      if (RegExp(/[A-Z]/i).exec(startPart)) {
        return startPart;
      }
      const startNum = parseFloat(startPart);
      const endNum = parseFloat(endPart);
      return ((endNum - startNum) * (progress / 100) + startNum).toFixed(2);
    }).join(' ');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-900 dark:to-cyan-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-teal-800 dark:text-teal-300">Morph Animation Showcase</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">Watch shapes transform smoothly with intuitive controls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
          >
            <motion.path
              d={interpolate(shapes[currentShape as keyof typeof shapes], shapes[nextShape as keyof typeof shapes], progress)}
              fill="url(#gradient)"
              stroke="#000"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Label>Current Shape</Label>
            <Select value={currentShape} onValueChange={(value) => handleShapeChange(value, false)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle"><div className="flex items-center"><Circle className="mr-2" />Circle</div></SelectItem>
                <SelectItem value="square"><div className="flex items-center"><Square className="mr-2" />Square</div></SelectItem>
                <SelectItem value="triangle"><div className="flex items-center"><Triangle className="mr-2" />Triangle</div></SelectItem>
                <SelectItem value="hexagon"><div className="flex items-center"><Hexagon className="mr-2" />Hexagon</div></SelectItem>
                <SelectItem value="star"><div className="flex items-center"><Star className="mr-2" />Star</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Next Shape</Label>
            <Select value={nextShape} onValueChange={(value) => handleShapeChange(value, true)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle"><div className="flex items-center"><Circle className="mr-2" />Circle</div></SelectItem>
                <SelectItem value="square"><div className="flex items-center"><Square className="mr-2" />Square</div></SelectItem>
                <SelectItem value="triangle"><div className="flex items-center"><Triangle className="mr-2" />Triangle</div></SelectItem>
                <SelectItem value="hexagon"><div className="flex items-center"><Hexagon className="mr-2" />Hexagon</div></SelectItem>
                <SelectItem value="star"><div className="flex items-center"><Star className="mr-2" />Star</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Morph Progress: {progress.toFixed(0)}%</Label>
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Animation Duration: {duration}s</Label>
          <Slider
            value={[duration]}
            onValueChange={handleDurationChange}
            min={0.5}
            max={5}
            step={0.1}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button onClick={handlePlayPause}>
              {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-play"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
            <Label htmlFor="auto-play">Auto-play</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Experiment with different shapes, control the morphing process, and watch the smooth transitions between various geometric forms.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MorphAnimation;