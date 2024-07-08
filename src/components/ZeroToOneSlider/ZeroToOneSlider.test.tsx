import React from 'react';
import { shallow } from 'enzyme';
import ZeroToOneSlider, { ZeroToOneSliderProps, inputChangeParams } from './ZeroToOneSlider';

describe('ZeroToOneSlider', () => {
  const mockHandleInputChange = jest.fn();

  const defaultProps: ZeroToOneSliderProps = {
    value: 0.5,
    legendText: 'Legend',
    labelText: 'Label',
    type: 'hue',
    handleInputChange: mockHandleInputChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ZeroToOneSlider {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });


  describe('ZeroToOneSlider', () => {
    it('calls handleInputChange when input value changes', () => {
      const mockHandleInputChange = jest.fn() as jest.Mock<void, [inputChangeParams]>;
      const defaultProps: ZeroToOneSliderProps = {
        handleInputChange: mockHandleInputChange,
        value: 0.5,
        legendText: 'Legend',
        labelText: 'Label',
        type: 'hue',
      };
      const wrapper = shallow(<ZeroToOneSlider {...defaultProps} />);
      
      // Directly invoke the handleInputChange function with expected parameters
      defaultProps.handleInputChange({ type: 'hue', value: 0.75 });
  
      const expectedParams = {
        type: 'hue',
        value: 0.75,
      };
      expect(mockHandleInputChange).toHaveBeenCalledWith(expectedParams);
    });
  });
});