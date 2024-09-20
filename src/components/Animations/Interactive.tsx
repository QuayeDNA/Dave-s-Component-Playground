import React, { useRef, useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MousePointer, RotateCcw, Maximize } from 'lucide-react';

const InteractiveAnimations = () => {
  const [dragConstraint, setDragConstraint] = useState(100);
  const [shape, setShape] = useState('circle');
  const constraintsRef = useRef(null);

  const [{ x, y, rotateZ, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
  }));

  const bind = useDrag(({ offset: [ox, oy], vxvy: [vx, vy], down, movement: [mx, my] }) => {
    api.start({
      x: down ? ox : 0,
      y: down ? oy : 0,
      rotateZ: down ? mx : 0,
      scale: down ? 1.2 : 1,
      immediate: down,
    });
  }, {
    bounds: { left: -dragConstraint, right: dragConstraint, top: -dragConstraint, bottom: dragConstraint },
    rubberband: true,
  });

  const getShapeStyle = () => {
    switch (shape) {
      case 'square':
        return { borderRadius: '0%' };
      case 'triangle':
        return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
      default:
        return { borderRadius: '50%' };
    }
  };

  const reset = () => {
    api.start({ x: 0, y: 0, rotateZ: 0, scale: 1 });
  };

  const interpolateColor = to([x, y], (x, y) => {
    const r = Math.floor((x + dragConstraint) / (2 * dragConstraint) * 255);
    const g = Math.floor((y + dragConstraint) / (2 * dragConstraint) * 255);
    const b = Math.floor(((x + y + 2 * dragConstraint) / (4 * dragConstraint)) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  });

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300">Interactive Animations</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">Explore gesture-based and interactive animations with react-spring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          ref={constraintsRef}
          className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden"
        >
          <animated.div
            {...bind()}
            style={{
              x,
              y,
              rotateZ,
              scale,
              backgroundColor: interpolateColor,
              width: 80,
              height: 80,
              ...getShapeStyle(),
              touchAction: 'none',
            }}
            className="cursor-grab active:cursor-grabbing flex items-center justify-center font-bold text-white"
          >
            Drag me!
          </animated.div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Drag Constraint: {dragConstraint}px</label>
            <Slider
              value={[dragConstraint]}
              onValueChange={(value) => setDragConstraint(value[0])}
              min={0}
              max={200}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Shape</label>
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Drag the shape to see interactive animations. The color changes based on position, 
          and rotation is affected by drag direction. Adjust the drag constraint to limit or expand the movable area.
          This demo showcases gesture-based interactions using react-spring and use-gesture.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InteractiveAnimations;