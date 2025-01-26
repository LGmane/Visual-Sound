// src/App.js
import React, { useContext, useState } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';
import ColorPicker from './components/AppLogic/ColorPicker';
import './styles/App.css';

function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext);

  // State für aktive Visualisierer und Hintergrundvideo
  const [activeVisualizers, setActiveVisualizers] = useState([]);
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false);

  // Zustand für Farben
  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)'); // Standard: Grün
  const [frequencyColor, setFrequencyColor] = useState('rgb(255, 0, 0)'); // Standard: Rot

  // Neuer Zustand für die mittige Darstellung des Frequency Visualizers
  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false);

  // Zustand für Balkenbreite (zwischen 1 und 10)
  const [barWidth, setBarWidth] = useState(2);

  // Funktion zum Umschalten eines Visualisierers
  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType) // Deaktivieren
        : [...prev, visualizerType] // Aktivieren
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

  return (
    <div className="app">
      <h1>Visual Sound</h1>
      <MasterVisualizer
        activeVisualizers={activeVisualizers}
        waveColor={waveColor}
        frequencyColor={frequencyColor}
        showBackgroundVideo={showBackgroundVideo} // Übergebe den Zustand
        isFrequencyCentered={isFrequencyCentered} // Neuer Zustand
        barWidth={barWidth} // Balkenbreite
      />
      <VisualizerSelector
        activeVisualizers={activeVisualizers}
        toggleVisualizer={toggleVisualizer}
        toggleBackgroundVideo={toggleBackgroundVideo} // Übergebe die Funktion
        showBackgroundVideo={showBackgroundVideo} // Übergebe den Zustand
        toggleFrequencyCentered={toggleFrequencyCentered} // Neue Prop
        isFrequencyCentered={isFrequencyCentered} // Neue Prop
        barWidth={barWidth} // Balkenbreite
        handleBarWidthChange={handleBarWidthChange} // Slider
      />
      <ColorPicker
        waveColor={waveColor}
        setWaveColor={setWaveColor}
        frequencyColor={frequencyColor}
        setFrequencyColor={setFrequencyColor}
      />
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
    </div>
  );
}

export default App;