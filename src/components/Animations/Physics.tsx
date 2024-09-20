/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, ArrowDown, Wind } from 'lucide-react';

const PhysicsAnimations = () => {
  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(1);
  const [elasticity, setElasticity] = useState(0.7);
  const [airResistance, setAirResistance] = useState(0.02);
  const [shape, setShape] = useState('circle');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const objectSize = 64;

  const [{ x, y }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0,
    vx: 0,
    vy: 0,
    config: { 
      mass: mass,
      tension: 0,
      friction: 0,
    } 
  }));

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerDimensions({ width: clientWidth, height: clientHeight });
      api.start({
        x: clientWidth / 2 - objectSize / 2,
        y: clientHeight / 2 - objectSize / 2,
      });
    }
  }, [api]);

  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = () => {
      const now = performance.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      api.start((prevState: any) => {
        const calculateNewPosition = (pos: number, vel: number, min: number, max: number) => {
          let newPos = pos + vel * deltaTime;
          let newVel = vel;

          if (newPos < min) {
            newPos = min;
            newVel = -newVel * elasticity;
          } else if (newPos > max) {
            newPos = max;
            newVel = -newVel * elasticity;
          }

          return [newPos, newVel];
        };

        const applyGravity = (vy: number) => vy + gravity * deltaTime;
        const applyAirResistance = (v: number) => v * (1 - airResistance);

        let newVy = applyGravity(prevState.vy);
        const [newX, newVx] = calculateNewPosition(prevState.x, prevState.vx, 0, containerDimensions.width - objectSize);
        const [newY, tempVy] = calculateNewPosition(prevState.y, newVy, 0, containerDimensions.height - objectSize);

        newVy = applyAirResistance(tempVy);

        return {
          x: newX,
          y: newY,
          vx: applyAirResistance(newVx),
          vy: newVy,
        };
      });

      requestAnimationFrame(updatePhysics);
    };

    const animationFrame = requestAnimationFrame(updatePhysics);

    return () => cancelAnimationFrame(animationFrame);
  }, [api, gravity, elasticity, airResistance, containerDimensions]);

  const bind = useDrag(({ movement: [mx, my], velocity: [vx, vy], down }) => {
    if (down) {
      api.start({ x: mx, y: my, immediate: true });
    } else {
      api.start({ 
        x: mx, 
        y: my, 
        vx: vx * 16,
        vy: vy * 16,
      });
    }
  });

  const reset = () => {
    api.start({ 
      x: containerDimensions.width / 2 - objectSize / 2, 
      y: containerDimensions.height / 2 - objectSize / 2,
      vx: 0,
      vy: 0,
    });
  };

  const jump = () => {
    api.start((state: any) => ({ ...state, vy: -400 }));
  };

  const randomForce = () => {
    const randomVx = (Math.random() - 0.5) * 800;
    const randomVy = -Math.random() * 800;
    api.start((state: any) => ({ ...state, vx: randomVx, vy: randomVy }));
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'square':
        return { width: `${objectSize}px`, height: `${objectSize}px` };
      case 'triangle':
        return { 
          width: 0, 
          height: 0, 
          borderLeft: `${objectSize / 2}px solid transparent`,
          borderRight: `${objectSize / 2}px solid transparent`,
          borderBottom: `${objectSize}px solid #10b981`,
          background: 'none'
        };
      default:
        return { width: `${objectSize}px`, height: `${objectSize}px`, borderRadius: '50%' };
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-teal-950 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-green-800 dark:text-green-300">
          Enhanced Physics Animations
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Explore advanced physics-based animations with react-spring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          ref={containerRef}
          className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden relative"
        >
          <animated.div
            {...bind()}
            style={{
              x,
              y,
              touchAction: 'none',
              background: '#10b981',
              ...getShapeStyle(),
              position: 'absolute',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"
            style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Gravity: {gravity.toFixed(1)}</label>
            <Slider
              value={[gravity]}
              onValueChange={(value) => setGravity(value[0])}
              min={0}
              max={20}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Mass: {mass.toFixed(1)}</label>
            <Slider
              value={[mass]}
              onValueChange={(value) => setMass(value[0])}
              min={0.1}
              max={5}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Elasticity: {elasticity.toFixed(2)}</label>
            <Slider
              value={[elasticity]}
              onValueChange={(value) => setElasticity(value[0])}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Air Resistance: {airResistance.toFixed(3)}</label>
            <Slider
              value={[airResistance]}
              onValueChange={(value) => setAirResistance(value[0])}
              min={0}
              max={0.1}
              step={0.001}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="shape" className="text-sm text-gray-600 dark:text-gray-400">Shape</label>
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
          <Button onClick={jump}>
            <ArrowDown className="mr-2 h-4 w-4 rotate-180" />
            Jump
          </Button>
          <Button onClick={randomForce}>
            <Wind className="mr-2 h-4 w-4" />
            Random Force
          </Button>
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Adjust gravity, mass, elasticity, and air resistance to see how they affect the object's motion. 
          Drag the object to throw it, or use the buttons to apply forces.
          The object is now confined within the white space.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PhysicsAnimations;