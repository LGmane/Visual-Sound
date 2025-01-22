// src/components/AppLogic/VisualizerSelector.js
import React from 'react';

function VisualizerSelector({ visualizerType, onChange }) {
  // Debugging-Logs für die Props
  console.log('VisualizerSelector - visualizerType:', visualizerType); // Zeigt den aktuellen Visualizer-Typ
  console.log('VisualizerSelector - onChange prop:', onChange);       // Überprüft, ob onChange eine Funktion ist

  return (
    <div>
      <label htmlFor="visualizer-type">Select Visualizer:</label>
      <select
        id="visualizer-type"
        value={visualizerType}
        onChange={(e) => {
          console.log('VisualizerSelector - onChange triggered:', e.target.value); // Zeigt das ausgewählte Visualizer-Typ
          onChange(e.target.value); // Ruft die onChange-Funktion auf
        }}
      >
        <option value="frequency">Frequency Visualizer</option>
        <option value="waveform">Waveform Visualizer</option>
      </select>
    </div>
  );
}

export default VisualizerSelector;

