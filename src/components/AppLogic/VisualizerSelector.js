// src/components/AppLogic/VisualizerSelector.js
import React from 'react';
import '../../styles/VisualizerSelector.css';

function VisualizerSelector({ activeVisualizers, toggleVisualizer, toggleBackgroundVideo, showBackgroundVideo }) {
  const visualizers = [
    { id: 'waveform', label: 'Waveform Visualizer' },
    { id: 'frequency', label: 'Frequency Visualizer' },
  ];

  return (
    <div className="visualizer-selector">
      <h3>Select Visualizers:</h3>
      <div className="visualizer-buttons">
        {visualizers.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => toggleVisualizer(id)}
            className={activeVisualizers.includes(id) ? 'visualizer-button active' : 'visualizer-button'}
          >
            {label}
          </button>
        ))}
        <button
          onClick={toggleBackgroundVideo}
          className={showBackgroundVideo ? 'visualizer-button active' : 'visualizer-button'}
        >
          Background Video
        </button>
      </div>
    </div>
  );
}

export default VisualizerSelector;
