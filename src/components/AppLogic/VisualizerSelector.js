// src/components/AppLogic/VisualizerSelector.js - Manages the selection and configuration of visualizers: Frequency, Waveform, Circle, and Ball

/**
 * 🎛️ VisualizerSelector Component
 * Provides buttons and controls to configure the visualizers and their specific options.
 * Allows selection of active visualizers and customization of colors and display modes.
 */

import React from 'react';
import "../../styles/App.css";

function VisualizerSelector({
  activeVisualizers,
  toggleVisualizer,
  toggleFrequencyCentered,
  isFrequencyCentered,
  waveformColor,
  handleWaveformColorChange,
  frequencyColor,
  handleFrequencyColorChange,
}) {

  // 🎨 Available visualizers and their display names
  const visualizers = [
    { id: 'waveform', label: 'Waveform Visualizer' },
    { id: 'frequency', label: 'Frequency Visualizer' },
    { id: 'circle', label: 'Circle Visualizer' },
    { id: 'ball', label: 'Ball Visualizer' }, 
  ];

  // 🌈 Predefined color palette for visualizer customization
  const colorPalette = [
    'rgb(0, 0, 0)',
    'rgb(255, 0, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 0, 255)',
    'rgb(255, 255, 0)',
    'rgb(255, 0, 255)',
    'rgb(0, 255, 255)',
    'rgb(255, 255, 255)',
  ];

  return (
    <div className="visualizer-selector">
      <h3>Select Visualizers:</h3>
      
      <div className="visualizer-buttons">
        {visualizers.map(({ id, label }) => (
          <div key={id} className="visualizer-button-group">
            
            {/* 🎛️ Button to toggle the visualizer on or off */}
            <button
              onClick={() => toggleVisualizer(id)}
              className={activeVisualizers.includes(id) ? 'visualizer-button active' : 'visualizer-button'}
            >
              {label}
            </button>

            {/* 📊 Frequency Visualizer options: color picker and centering toggle */}
            {id === 'frequency' && activeVisualizers.includes('frequency') && (
              <>
                <div className="color-picker-button" onClick={(e) => e.stopPropagation()}>
                  {colorPalette.map((color) => (
                    <div
                      key={color}
                      className={`color-segment ${color === frequencyColor ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleFrequencyColorChange(color)}
                    />
                  ))}
                </div>

                {/* 🔄 Toggle between centered and bottom alignment for Frequency Visualizer */}
                <button
                  onClick={toggleFrequencyCentered}
                  className="visualizer-button"
                >
                  {isFrequencyCentered ? 'Centered' : 'Bottom'}
                </button>
              </>
            )}

            {/* 🌊 Waveform Visualizer color picker */}
            {id === 'waveform' && activeVisualizers.includes('waveform') && (
              <div className="color-picker-button" onClick={(e) => e.stopPropagation()}>
                {colorPalette.map((color) => (
                  <div
                    key={color}
                    className={`color-segment ${color === waveformColor ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleWaveformColorChange(color)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualizerSelector;
