// src/components/AppLogic/VisualizerSelector.js - Korrigiert: Frequency, Waveform, Circle und Oscilloscope Visualizer

import React from 'react';
import "../../styles/App.css";

/**
 * 🎛️ VisualizerSelector Komponente
 * Stellt Schaltflächen und Steuerungen zur Verfügung, um die Visualizer und deren Optionen zu konfigurieren.
 */
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
  
  // 🎨 Verfügbare Visualizer und deren Bezeichnungen
  const visualizers = [
    { id: 'waveform', label: 'Waveform Visualizer' },
    { id: 'frequency', label: 'Frequency Visualizer' },
    { id: 'circle', label: 'Circle Visualizer' },
    { id: 'oscilloscope', label: 'Oscilloscope Visualizer' }, // Oscilloscope hinzugefügt
  ];

  // 🎨 Vordefinierte Farbpalette
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
            <button
              onClick={() => toggleVisualizer(id)}
              className={activeVisualizers.includes(id) ? 'visualizer-button active' : 'visualizer-button'}
            >
              {label}
            </button>

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

                <button
                  onClick={toggleFrequencyCentered}
                  className="visualizer-button"
                >
                  {isFrequencyCentered ? 'Centered' : 'Bottom'}
                </button>
              </>
            )}

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
