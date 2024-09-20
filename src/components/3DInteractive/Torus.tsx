import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, TorusKnot, Box, Sphere, Sky, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Sun, Moon } from 'lucide-react';

type ShapeType = 'torusKnot' | 'box' | 'sphere';
interface InteractiveObjectProps {
    color: string;
    autoRotate: boolean;
    roughness: number;
    metalness: number;
    textureUrl: string | null;
    shape: ShapeType;
  }
  
  function InteractiveObject({ color, autoRotate, roughness, metalness, textureUrl, shape }: Readonly<InteractiveObjectProps>) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [textureError, setTextureError] = useState<string | null>(null);
  
    useEffect(() => {
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(
          textureUrl,
          (loadedTexture) => {
            setTexture(loadedTexture);
            setTextureError(null);
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            setTextureError('Failed to load texture');
            setTexture(null);
          }
        );
      } else {
        setTexture(null);
        setTextureError(null);
      }
    }, [textureUrl]);
  
    useFrame((_, delta) => {
      if (autoRotate && meshRef.current) {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.5;
      }
    });
  
    const material = (
      <meshStandardMaterial
        color={textureError || !texture ? color : undefined}
        roughness={roughness}
        metalness={metalness}
        map={texture}
      />
    );


  switch (shape) {
    case 'torusKnot':
      return (
        <TorusKnot ref={meshRef} args={[1, 0.3, 128, 16]} castShadow receiveShadow>
          {material}
        </TorusKnot>
      );
    case 'box':
      return (
        <Box ref={meshRef} args={[1.5, 1.5, 1.5]} castShadow receiveShadow>
          {material}
        </Box>
      );
    case 'sphere':
      return (
        <Sphere ref={meshRef} args={[1, 32, 32]} castShadow receiveShadow>
          {material}
        </Sphere>
      );
  }
}

interface LightingProps {
  lightType: string;
  intensity: number;
  position: [number, number, number];
  castShadow: boolean;
}

function Lighting({ lightType, intensity, position, castShadow }: Readonly<LightingProps>) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  switch (lightType) {
    case 'ambient':
      return <ambientLight ref={ambientLightRef} intensity={intensity} />;
    case 'directional':
      return <directionalLight ref={directionalLightRef} position={position} intensity={intensity} castShadow={castShadow} />;
    case 'point':
      return <pointLight ref={pointLightRef} position={position} intensity={intensity} castShadow={castShadow} />;
    case 'spot':
      return <spotLight ref={spotLightRef} position={position} intensity={intensity} castShadow={castShadow} angle={Math.PI / 6} />;
    default:
      return null;
  }
}

export default function EnhancedInteractive3DScene() {
  const [objectColor, setObjectColor] = useState('#ff6b6b');
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([-4, 3, 5]);
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.5);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [lightType, setLightType] = useState('directional');
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightPosition, setLightPosition] = useState<[number, number, number]>([5, 5, 5]);
  const [castShadow, setCastShadow] = useState(true);
  const [shape, setShape] = useState<'torusKnot' | 'box' | 'sphere'>('torusKnot');
  const [isControlOpen, setIsControlOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const handleResetCamera = () => {
    setCameraPosition([-4, 3, 5]);
  };

  const toggleControlPanel = () => {
    setIsControlOpen(!isControlOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col md:flex-row h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
    <div className="flex-grow relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Lighting lightType={lightType} intensity={lightIntensity} position={lightPosition} castShadow={castShadow} />
        <Suspense fallback={null}>
          <InteractiveObject
            color={objectColor}
            autoRotate={autoRotate}
            roughness={roughness}
            metalness={metalness}
            textureUrl={textureUrl}
            shape={shape}
          />
        </Suspense>
          <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.5} />
          </mesh>
          <Sky />
          {showStars && <Stars />}
        </Canvas>
        <Button
          className="absolute top-4 right-4 md:hidden"
          onClick={toggleControlPanel}
        >
          {isControlOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <div className={`w-full md:w-96 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${isControlOpen ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Card className={`backdrop-blur-lg hover:shadow-lg transition-shadow duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>3D Scene Controls</CardTitle>
              <Button onClick={toggleDarkMode} variant="outline" size="icon">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>Adjust the properties of the 3D scene</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="object" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="object">Object</TabsTrigger>
                <TabsTrigger value="lighting">Lighting</TabsTrigger>
                <TabsTrigger value="scene">Scene</TabsTrigger>
              </TabsList>
              <TabsContent value="object" className="space-y-4">
                <div>
                  <label htmlFor="shape" className="block text-sm font-medium">Shape</label>
                  <Select value={shape} onValueChange={(value: 'torusKnot' | 'box' | 'sphere') => setShape(value)}>
                    <SelectTrigger id="shape">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="torusKnot">Torus Knot</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="sphere">Sphere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="object-color" className="block text-sm font-medium">Object Color</label>
                  <div className="flex space-x-2">
                    <input 
                      id="object-color"
                      type="color" 
                      value={objectColor} 
                      onChange={(e) => setObjectColor(e.target.value)}
                      className="mt-1 block w-full"
                    />
                    <Button onClick={() => setTextureUrl(null)}>Use Color</Button>
                  </div>
                </div>
                <div>
                  <label htmlFor="texture-url" className="block text-sm font-medium">Texture URL</label>
                  <div className="flex space-x-2">
                    <input 
                      id="texture-url"
                      type="text" 
                      value={textureUrl ?? ''} 
                      onChange={(e) => setTextureUrl(e.target.value)}
                      className={`mt-1 block w-full p-1 ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-white'}`}
                    />
                    <Button onClick={() => setTextureUrl('/assets/textures/texture.jpg')}>Use Texture</Button>
                  </div>
                </div>
                <div>
                  <label htmlFor="roughness" className="block text-sm font-medium">Roughness</label>
                  <Slider
                    id="roughness"
                    value={[roughness]}
                    onValueChange={(value) => setRoughness(value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="metalness" className="block text-sm font-medium">Metalness</label>
                  <Slider
                    id="metalness"
                    value={[metalness]}
                    onValueChange={(value) => setMetalness(value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-rotate"
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                  />
                  <label htmlFor="auto-rotate" className="text-sm font-medium">
                    Auto Rotate
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="lighting" className="space-y-4">
                <div>
                  <label htmlFor="light-type" className="block text-sm font-medium">Light Type</label>
                  <Select value={lightType} onValueChange={setLightType}>
                    <SelectTrigger id="light-type">
                      <SelectValue placeholder="Select light type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="directional">Directional</SelectItem>
                      <SelectItem value="point">Point</SelectItem>
                      <SelectItem value="spot">Spot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="light-intensity" className="block text-sm font-medium">Light Intensity</label>
                  <Slider
                    id="light-intensity"
                    value={[lightIntensity]}
                    onValueChange={(value) => setLightIntensity(value[0])}
                    min={0}
                    max={2}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="light-position-x" className="block text-sm font-medium">Light Position X</label>
                  <Slider
                    id="light-position-x"
                    value={[lightPosition[0]]}
                    onValueChange={(value) => setLightPosition([value[0], lightPosition[1], lightPosition[2]])}
                    min={-10}
                    max={10}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="light-position-y" className="block text-sm font-medium">Light Position Y</label>
                  <Slider
                    id="light-position-y"
                    value={[lightPosition[1]]}
                    onValueChange={(value) => setLightPosition([lightPosition[0], value[0], lightPosition[2]])}
                    min={-10}
                    max={10}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="light-position-z" className="block text-sm font-medium">Light Position Z</label>
                  <Slider
                    id="light-position-z"
                    value={[lightPosition[2]]}
                    onValueChange={(value) => setLightPosition([lightPosition[0], lightPosition[1], value[0]])}
                    min={-10}
                    max={10}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cast-shadow"
                    checked={castShadow}
                    onCheckedChange={setCastShadow}
                  />
                  <label htmlFor="cast-shadow" className="text-sm font-medium">
                    Cast Shadow
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="scene" className="space-y-4">
                <div>
                  <label htmlFor="camera-distance" className="block text-sm font-medium">Camera Distance</label>
                  <Slider
                    id="camera-distance"
                    value={[cameraPosition[2]]}
                    onValueChange={(value) => setCameraPosition(prev => [prev[0], prev[1], value[0]])}
                    min={1}
                    max={10}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="camera-height" className="block text-sm font-medium">Camera Height</label>
                  <Slider
                    id="camera-height"
                    value={[cameraPosition[1]]}
                    onValueChange={(value) => setCameraPosition(prev => [prev[0], value[0], prev[2]])}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-stars"
                    checked={showStars}
                    onCheckedChange={setShowStars}
                  />
                  <label htmlFor="show-stars" className="text-sm font-medium">
                    Show Stars
                  </label>
                </div>
                <Button onClick={handleResetCamera}>Reset Camera</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}