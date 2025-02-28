// src/App.js - Manages the overall application state and orchestrates audio visualization

/**
 * 🎛️ App Component
 * Manages the global state and interactions between core components:
 * - 🎙️ DeviceSelector: Allows the selection of an audio input device.
 * - 🎛️ VisualizerSelector: Enables the selection and configuration of visualizers.
 * - 🎵 MasterVisualizer: Renders active visualizers based on audio input.
 * 
 * Supports dynamic color customization, visualization modes, and fullscreen functionality.
 * Ensures that a valid audio device is selected and appropriately passed to the visualizer components.
 */

import React, { useContext, useState, useEffect } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';
import './styles/App.css';

function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext); // 🎯 Retrieves selectedDevice from AudioContext

  const [activeVisualizers, setActiveVisualizers] = useState([]); // 🎛️ Active visualizers

  // 🎨 Color settings for waveform and frequency visualizers
  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)');
  const [frequencyColor, setFrequencyColor] = useState('rgb(0, 0, 255)');

  // 📊 Visualization options
  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false);
  
  // ⛶ Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * 🎶 Toggles the activation state of a visualizer
   * @param {string} visualizerType - The type of visualizer to toggle
   */
  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType)
        : [...prev, visualizerType]
    );
  };

  /**
   * 📊 Toggles the frequency visualizer between centered and bottom display
   */
  const toggleFrequencyCentered = () => {
    setIsFrequencyCentered((prev) => !prev);
  };

  /**
   * 🎨 Handles changes in the frequency visualizer color
   * @param {string} color - The selected color for the frequency visualizer
   */
  const handleFrequencyColorChange = (color) => {
    console.log('Frequency color selected:', color);
    setFrequencyColor(color);
  };

  /**
   * ⛶ Toggles fullscreen mode
   */
  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  /**
   * ⎋ Exits fullscreen mode when the 'Escape' key is pressed
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  return (
    <div className="app">
      <h1>Visual Sound</h1>

      {/* 🎵 Master Visualizer handles the main audio visualization */}
      <MasterVisualizer
        selectedDevice={selectedDevice} // 🎯 Important: Passes selectedDevice correctly!
        activeVisualizers={activeVisualizers}
        waveColor={waveColor}
        frequencyColor={frequencyColor}
        isFrequencyCentered={isFrequencyCentered}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleFullscreenToggle}
      />

      {/* 🎛️ Visualizer Selector for choosing and configuring visualizers */}
      <VisualizerSelector
        activeVisualizers={activeVisualizers}
        toggleVisualizer={toggleVisualizer}
        toggleFrequencyCentered={toggleFrequencyCentered}
        isFrequencyCentered={isFrequencyCentered}
        waveformColor={waveColor}
        handleWaveformColorChange={setWaveColor}
        frequencyColor={frequencyColor}
        handleFrequencyColorChange={handleFrequencyColorChange}
      />

      {/* 🎙️ Device Selector for choosing an audio input device */}
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
    </div>
  );
}

export default App;
