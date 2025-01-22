// src/components/AppLogic/VisualizerSelector.js
import React from 'react';

function VisualizerSelector({ activeVisualizers, toggleVisualizer, toggleBackgroundVideo, showBackgroundVideo }) {
  const visualizers = [
    { id: 'waveform', label: 'Waveform Visualizer' },
    { id: 'frequency', label: 'Frequency Visualizer' },
  ];

  return (
    <div>
      <h3>Select Visualizers:</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {visualizers.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => toggleVisualizer(id)}
            style={{
              padding: '10px',
              border: activeVisualizers.includes(id) ? '2px solid green' : '1px solid gray',
              backgroundColor: activeVisualizers.includes(id) ? '#e0ffe0' : '#fff',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={toggleBackgroundVideo}
          style={{
            padding: '10px',
            border: showBackgroundVideo ? '2px solid blue' : '1px solid gray',
            backgroundColor: showBackgroundVideo ? '#e0f0ff' : '#fff',
            cursor: 'pointer',
          }}
        >
          Background Video
        </button>
      </div>
    </div>
  );
}

export default VisualizerSelector;
