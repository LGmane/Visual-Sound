// src/App.js - Hauptkomponente der Anwendung, verwaltet globale Zustände und koordiniert die Darstellung der Visualizer und Einstellungen

import React, { useContext, useState, useEffect } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';
import './styles/App.css';
function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext);

  // 🎨 State-Verwaltung für Visualizer und UI-Einstellungen
  const [activeVisualizers, setActiveVisualizers] = useState([]); // Aktive Visualisierungstypen
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false); // Steuerung des Hintergrundvideos

  // 🎨 Farben für die Visualisierungen
  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)'); // Grün für Wellenform
  const [frequencyColor, setFrequencyColor] = useState('rgb(255, 0, 0)'); // Rot für Frequenz
  const [volumeColor, setVolumeColor] = useState('rgb(0, 0, 255)'); // Blau für Lautstärke
  
  // 🛠 Visualizer-Einstellungen
  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false); // Zentrierung des Frequenz-Visualizers
  const [barWidth, setBarWidth] = useState(2); // Breite der Frequenzbalken
  const [waveformThickness, setWaveformThickness] = useState(2); // Dicke der Wellenlinien

  // 🖥 Fullscreen-Modus
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🔀 Umschalten eines Visualizers
  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType)
        : [...prev, visualizerType]
    );
  };

  // 🎬 Hintergrundvideo ein-/ausschalten
  const toggleBackgroundVideo = () => {
    setShowBackgroundVideo((prev) => !prev);
  };

  // 🆙 Zentrierung des Frequenz-Visualizers umschalten
  const toggleFrequencyCentered = () => {
    setIsFrequencyCentered((prev) => !prev);
  };

  // 🧮 Balkenbreite für den Frequenz-Visualizer ändern
  const handleBarWidthChange = (event) => {
    setBarWidth(parseInt(event.target.value, 10));
  };

  // ✏️ Wellenlinien-Dicke ändern
  const handleWaveformThicknessChange = (value) => {
    setWaveformThickness(value);
  };

  // 🎨 Frequenzfarbe ändern
  const handleFrequencyColorChange = (color) => {
    console.log('Frequency color selected:', color); // Nur für Debugging-Zwecke
    setFrequencyColor(color);
  };

  // 🔲 Fullscreen-Modus umschalten
  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  // 🆕 Fullscreen automatisch bei ESC-Taste beenden
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

      {/* 🎶 MasterVisualizer rendert die aktive Audio-Visualisierung */}
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

      {/* 🛠 VisualizerSelector ermöglicht das Konfigurieren der Visualizer */}
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

      {/* 🎧 DeviceSelector ermöglicht die Auswahl des Audioeingangs */}
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
    </div>
  );
}

export default App;