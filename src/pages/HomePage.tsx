import React from 'react';

import ContrastSafeColourPicker from '../components/ContrastSafeColourPicker/ContrastSafeColourPicker';
import {onChangeColor} from '@/components/ContrastSafeColourPicker/ContrastSafeColourPicker';
import { colorHexValue } from '@/components/ContrastSafeColourPicker/colour.types';


const HomePage: React.FC = () => {

  const [color, setColor] = React.useState<colorHexValue>("#005600");


  const handleColorChange: onChangeColor = (color: colorHexValue): void => {
    console.log(`Color changed to ${color}`);
    setColor(color);
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <ContrastSafeColourPicker color={color} onChangeColor={handleColorChange} />
    </div>
  );
};

export default HomePage;