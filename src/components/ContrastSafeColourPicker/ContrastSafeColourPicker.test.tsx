import React from 'react';
import { mount } from 'enzyme';
import ContrastSafeColourPicker from './ContrastSafeColourPicker';
import { inputChangeParams , } from '.././ZeroToOneSlider/ZeroToOneSlider';
import { colorHexValue } from './colour.types';

jest.mock('.././ZeroToOneSlider/ZeroToOneSlider', () => {


    const mockProps = {
        value: 0,
        handleInputChange: jest.fn(),
        type: 'hue',
    }

    return (props: inputChangeParams) => (
        <input
            type="range"
            value={props.value}
            onChange={(e) => mockProps.handleInputChange({ type: props.type, value: parseFloat(e.target.value) })}
        />
    );
});

describe('ContrastSafeColourPicker Component', () => {
    it('renders without crashing', () => {

        const hexColor:colorHexValue    = "#ff0000";

        const props = {
            color: hexColor,
            onChangeColor: jest.fn(),
        };

        const wrapper = mount(<ContrastSafeColourPicker {...props} />);
        expect(wrapper).toBeTruthy();
    });
});