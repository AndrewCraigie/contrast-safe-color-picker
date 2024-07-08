import React from 'react';

import './ZeroToOneSlider.scss';

export type inputChangeType = "hue" | "lightness" | "saturation";

export type inputChangeParams = {
    type: inputChangeType;
    value: number;
};

export interface ZeroToOneSliderProps {
    value: number;
    legendText: string;
    labelText: string;
    type: inputChangeType;
    handleInputChange: (params: inputChangeParams) => void;
}

const ZeroToOneSlider: React.FC<ZeroToOneSliderProps> = ({
    value,
    legendText,
    labelText,
    type,
    handleInputChange
}) => {
    const inputId = `zero-to-one-slider-input-${type}`;

    const inputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: inputChangeType
    ) => {
        const value = parseFloat(event.target.value);

        handleInputChange({
            type: type,
            value: value,
        });
    };

    return (
        <fieldset className="zero-to-one-slider">
            <legend className="visually-hidden">{legendText}</legend>
            <label
                id={`zero-to-one-slider-label-${type}`}
                htmlFor={inputId}
                className="zero-to-one-slider-label"
            >
                {labelText}
            </label>
            <input
                id={inputId}
                name={inputId}
                className="zero-to-one-slider-input"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onInput={(event) => {
                    inputChange(event as React.ChangeEvent<HTMLInputElement>, type);
                }}
            />
        </fieldset>
    );
};

export default ZeroToOneSlider;
