// src/App.js - Fix: Übergabe von selectedDevice an den MasterVisualizer

import React, { useContext, useState, useEffect } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';
import './styles/App.css';

function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext); // 🎯 selectedDevice wieder hinzugefügt

  const [activeVisualizers, setActiveVisualizers] = useState([]);
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false);

  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)');
  const [frequencyColor, setFrequencyColor] = useState('rgb(255, 0, 0)');
  const [volumeColor, setVolumeColor] = useState('rgb(0, 0, 255)');

  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false);
  const [barWidth, setBarWidth] = useState(2);
  const [waveformThickness, setWaveformThickness] = useState(2);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType)
        : [...prev, visualizerType]
    );
  };

  const toggleFrequencyCentered = () => {
    setIsFrequencyCentered((prev) => !prev);
  };

  const handleBarWidthChange = (event) => {
    setBarWidth(parseInt(event.target.value, 10));
  };

  const handleWaveformThicknessChange = (value) => {
    setWaveformThickness(value);
  };

  const handleFrequencyColorChange = (color) => {
    console.log('Frequency color selected:', color);
    setFrequencyColor(color);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

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

      <MasterVisualizer
        selectedDevice={selectedDevice} // 🎯 WICHTIG: selectedDevice wird nun korrekt übergeben!
        activeVisualizers={activeVisualizers}
        waveColor={waveColor}
        frequencyColor={frequencyColor}
        volumeColor={volumeColor}
        showBackgroundVideo={showBackgroundVideo}
        isFrequencyCentered={isFrequencyCentered}
        barWidth={barWidth}
        waveformThickness={waveformThickness}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleFullscreenToggle}
      />

      <VisualizerSelector
        activeVisualizers={activeVisualizers}
        toggleVisualizer={toggleVisualizer}
        toggleFrequencyCentered={toggleFrequencyCentered}
        isFrequencyCentered={isFrequencyCentered}
        barWidth={barWidth}
        handleBarWidthChange={handleBarWidthChange}
        waveformThickness={waveformThickness}
        handleWaveformThicknessChange={handleWaveformThicknessChange}
        waveformColor={waveColor}
        handleWaveformColorChange={setWaveColor}
        frequencyColor={frequencyColor}
        handleFrequencyColorChange={handleFrequencyColorChange}
        volumeColor={volumeColor}
        handleVolumeColorChange={setVolumeColor}
      />

      <DeviceSelector onDeviceSelect={setSelectedDevice} />
    </div>
  );
}

export default App;
