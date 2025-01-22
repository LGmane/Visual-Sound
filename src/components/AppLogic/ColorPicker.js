// src/components/AppLogic/ColorPicker.js
import React from 'react';
import '../../styles/ColorPicker.css';

function ColorPicker({ waveColor, setWaveColor, frequencyColor, setFrequencyColor }) {
  return (
    <div className="color-picker">
      <h3>Customize Colors:</h3>
      <div className="color-picker__controls">
        <div className="color-picker__control">
          <label htmlFor="waveColor">Waveform Color:</label>
          <input
            type="color"
            id="waveColor"
            value={waveColor}
            onChange={(e) => setWaveColor(e.target.value)}
          />
        </div>
        <div className="color-picker__control">
          <label htmlFor="frequencyColor">Frequency Spectrum Color:</label>
          <input
            type="color"
            id="frequencyColor"
            value={frequencyColor}
            onChange={(e) => setFrequencyColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
