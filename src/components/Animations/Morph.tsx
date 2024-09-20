import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

const shapes: { [key: string]: string } = {
  circle: "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0",
  square: "M10,10 h80 v80 h-80 Z",
  triangle: "M50,10 L90,90 L10,90 Z"
};

const MorphingAnimation = () => {
  const [currentShape, setCurrentShape] = useState('circle');

  const nextShape = () => {
    const shapeKeys = Object.keys(shapes);
    const currentIndex = shapeKeys.indexOf(currentShape);
    const nextIndex = (currentIndex + 1) % shapeKeys.length;
    setCurrentShape(shapeKeys[nextIndex]);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-lg">
      <svg width="200" height="200" viewBox="0 0 100 100">
        <motion.path
          d={shapes[currentShape]}
          fill="#8b5cf6"
          animate={{ d: shapes[currentShape] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <Button onClick={nextShape}>
        Change Shape
      </Button>
    </div>
  );
};

export default MorphingAnimation;