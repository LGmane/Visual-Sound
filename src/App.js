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

  return (
    <div className="app">
      <h1>Visual Sound</h1>
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
      <VisualizerSelector
        activeVisualizers={activeVisualizers}
        toggleVisualizer={toggleVisualizer}
        toggleBackgroundVideo={toggleBackgroundVideo} // Übergebe die Funktion
        showBackgroundVideo={showBackgroundVideo} // Übergebe den Zustand
      />
      <ColorPicker
        waveColor={waveColor}
        setWaveColor={setWaveColor}
        frequencyColor={frequencyColor}
        setFrequencyColor={setFrequencyColor}
      />
      <MasterVisualizer
        activeVisualizers={activeVisualizers}
        waveColor={waveColor}
        frequencyColor={frequencyColor}
        showBackgroundVideo={showBackgroundVideo} // Übergebe den Zustand
      />
    </div>
  );
}

export default App;
