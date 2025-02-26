// src/App.js
import React, { useContext, useState, useEffect } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';
import './styles/App.css';

function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext);

  // State für aktive Visualisierer und Hintergrundvideo
  const [activeVisualizers, setActiveVisualizers] = useState([]);
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false);

  // Farben und Visualisierungseinstellungen
  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)'); // Grün
  const [frequencyColor, setFrequencyColor] = useState('rgb(255, 0, 0)'); // Rot
  const [volumeColor, setVolumeColor] = useState('rgb(0, 0, 255)'); // Blau

  // Einstellungen für Visualizer
  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false);
  const [barWidth, setBarWidth] = useState(2);
  const [waveformThickness, setWaveformThickness] = useState(2);

  // Fullscreen-Modus verwalten
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Funktion zum Umschalten eines Visualisierers
  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType)
        : [...prev, visualizerType]
    );
  };

  // Funktion zum Umschalten des Hintergrundvideos
  const toggleBackgroundVideo = () => {
    setShowBackgroundVideo((prev) => !prev);
  };

  // Funktion zum Umschalten der mittigen Darstellung
  const toggleFrequencyCentered = () => {
    setIsFrequencyCentered((prev) => !prev);
  };

  // Funktion zur Änderung der Balkenbreite
  const handleBarWidthChange = (event) => {
    setBarWidth(parseInt(event.target.value, 10));
  };

  // Funktion zur Änderung der Waveform-Dicke
  const handleWaveformThicknessChange = (value) => {
    setWaveformThickness(value);
  };

  // Funktion zur Änderung der Frequenzfarbe
  const handleFrequencyColorChange = (color) => {
    console.log('Frequency color selected:', color);
    setFrequencyColor(color);
  };

  // Funktion für den Fullscreen-Toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  // 🆕 Fullscreen automatisch beenden bei ESC
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
        toggleBackgroundVideo={toggleBackgroundVideo}
        showBackgroundVideo={showBackgroundVideo}
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