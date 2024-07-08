import React, {useRef, useState, useEffect} from 'react';

import ContrastSafeColourPicker from '../components/ContrastSafeColourPicker/ContrastSafeColourPicker';
import {onChangeColor} from '@/components/ContrastSafeColourPicker/ContrastSafeColourPicker';
import { colorHexValue } from '@/components/ContrastSafeColourPicker/colour.types';

import './HomePage.scss';

const HomePage: React.FC = () => {

  const [color, setColor] = useState<colorHexValue>("#005600");
  const [canvasWidth, setCanvasWidth] = useState<number>(200);
  const [canvasHeight, setCanvasHeight] = useState<number>(150);

  const contentRef = useRef<HTMLDivElement>(null);


  const handleColorChange: onChangeColor = (color: colorHexValue): void => {
    console.log(`Color changed to ${color}`);
    setColor(color);
  }

  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>

      <div 
      ref={contentRef}
      className="home-content"
      
      >
        <ContrastSafeColourPicker 
        color={color} 
        onChangeColor={handleColorChange} 
        />

      </div>

      
    </div>
  );
};

export default HomePage;