import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Define props for the Box component
interface BoxProps {
  position: [number, number, number];
  color: string;
  rotationSpeed: number;
}

// Box component represents a 3D cube in the scene
function Box({ position, color, rotationSpeed }: BoxProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // This hook runs on every frame, updating the cube's rotation
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed;
      mesh.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh
      position={position}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
    </mesh>
  );
}

// Main component that renders the 3D scene and UI controls
export default function EnhancedBasics() {
  const [boxColor, setBoxColor] = useState('#FFA500'); // Default orange color
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} color={boxColor} rotationSpeed={rotationSpeed} />
          <Box position={[1.2, 0, 0]} color={boxColor} rotationSpeed={rotationSpeed} />
        </Canvas>
      </div>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>3D Scene Controls</CardTitle>
          <CardDescription>Adjust the properties of the 3D scene</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Box Color</label>
              <input 
                type="color" 
                value={boxColor} 
                onChange={(e) => setBoxColor(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rotation Speed</label>
              <Slider
                value={[rotationSpeed]}
                onValueChange={(value) => setRotationSpeed(value[0])}
                max={0.1}
                step={0.001}
                className="mt-1"
              />
            </div>
            <Button onClick={() => {setBoxColor('#FFA500'); setRotationSpeed(0.01);}}>
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}