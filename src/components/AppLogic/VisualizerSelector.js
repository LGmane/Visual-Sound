// src/components/AppLogic/VisualizerSelector.js - Korrigiert: Nur Frequency, Waveform und Circle Visualizer

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
  barWidth,
  handleBarWidthChange,
  waveformThickness,
  handleWaveformThicknessChange,
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
  ];

  // 🎨 Vordefinierte Farbpalette
  const colorPalette = [
    'rgb(0, 0, 0)',      // Schwarz
    'rgb(255, 0, 0)',    // Rot
    'rgb(0, 255, 0)',    // Grün
    'rgb(0, 0, 255)',    // Blau
    'rgb(255, 255, 0)',  // Gelb
    'rgb(255, 0, 255)',  // Magenta
    'rgb(0, 255, 255)',  // Cyan
    'rgb(255, 255, 255)',// Weiß
  ];

  return (
    <div className="visualizer-selector">
      <h3>Select Visualizers:</h3>
      <div className="visualizer-buttons">
        
        {visualizers.map(({ id, label }) => (
          <div key={id} className="visualizer-button-group">
            
            {/* 🎛️ Umschalt-Button für jeden Visualizer */}
            <button
              onClick={() => toggleVisualizer(id)}
              className={activeVisualizers.includes(id) ? 'visualizer-button active' : 'visualizer-button'}
            >
              {label}
            </button>
  
            {/* 🎨 Optionen für den Frequency Visualizer */}
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
  
                <div className="bar-width-slider">
                  <label htmlFor="bar-width">Bar Width: {barWidth}</label>
                  <input
                    type="range"
                    id="bar-width"
                    className="simple-slider"
                    min="1"
                    max="10"
                    value={barWidth}
                    onChange={handleBarWidthChange}
                  />
                </div>
  
                <button
                  onClick={toggleFrequencyCentered}
                  className="visualizer-button"
                >
                  {isFrequencyCentered ? 'Centered' : 'Bottom'}
                </button>
              </>
            )}
  
            {/* 🌊 Optionen für den Waveform Visualizer */}
            {id === 'waveform' && activeVisualizers.includes('waveform') && (
              <>
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
  
                <div className="bar-width-slider">
                  <label htmlFor="waveform-thickness">Waveform Thickness: {waveformThickness}</label>
                  <input
                    type="range"
                    id="waveform-thickness"
                    className="simple-slider"
                    min="1"
                    max="10"
                    value={waveformThickness}
                    onChange={(event) => handleWaveformThicknessChange(parseInt(event.target.value, 10))}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualizerSelector;
