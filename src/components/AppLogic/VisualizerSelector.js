// src/components/AppLogic/VisualizerSelector.js
import React from 'react';
import '../../styles/VisualizerSelector.css';

function VisualizerSelector({ activeVisualizers, toggleVisualizer, toggleBackgroundVideo, showBackgroundVideo, toggleFrequencyCentered, isFrequencyCentered }) {
  const visualizers = [
    { id: 'waveform', label: 'Waveform Visualizer' },
    { id: 'frequency', label: 'Frequency Visualizer' },
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
            {/* Zusätzlicher Button für Darstellung unter FrequencyVisualizer */}
            {id === 'frequency' && activeVisualizers.includes('frequency') && (
              <button
                onClick={toggleFrequencyCentered}
                className="visualizer-button"
              >
                {isFrequencyCentered ? 'Frequency unten' : 'Frequency mittig'}
              </button>
            )}
          </div>
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