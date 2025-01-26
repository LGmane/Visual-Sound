import React from 'react';
import '../../styles/VisualizerSelector.css';

function VisualizerSelector({
  activeVisualizers,
  toggleVisualizer,
  toggleBackgroundVideo,
  showBackgroundVideo,
  toggleFrequencyCentered,
  isFrequencyCentered,
  barWidth,
  handleBarWidthChange,
  waveformThickness,
  handleWaveformThicknessChange,
}) {
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
            {id === 'frequency' && activeVisualizers.includes('frequency') && (
              <>
                <button
                  onClick={toggleFrequencyCentered}
                  className="visualizer-button"
                >
                  {isFrequencyCentered ? 'Centered' : 'Bottom'}
                </button>
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
              </>
            )}
            {id === 'waveform' && activeVisualizers.includes('waveform') && (
              <>
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