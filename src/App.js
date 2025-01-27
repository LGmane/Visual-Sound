// src/App.js
import React, { useContext, useState } from 'react';
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

  // Zustand für Farben
  const [waveColor, setWaveColor] = useState('rgb(0, 255, 0)'); // Standard: Grün
  const [frequencyColor, setFrequencyColor] = useState('rgb(255, 0, 0)'); // Standard: Rot

  // Neuer Zustand für die mittige Darstellung des Frequency Visualizers
  const [isFrequencyCentered, setIsFrequencyCentered] = useState(false);

  // Zustand für Balkenbreite (zwischen 1 und 10)
  const [barWidth, setBarWidth] = useState(2);

  // Zustand für die Dicke der Wellenlinien
  const [waveformThickness, setWaveformThickness] = useState(2);

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

  // Funktion zur Änderung der Waveform-Dicke
  const handleWaveformThicknessChange = (value) => {
    setWaveformThickness(value);
  };

  const handleFrequencyColorChange = (color) => {
    console.log('Frequency color selected:', color); // Debugging
    setFrequencyColor(color); // State aktualisieren
  };

  const [volumeColor, setVolumeColor] = useState('rgb(0, 0, 255)'); // Standard: Blau

  return (
    <div className="app">
      <h1>Visual Sound</h1>
      <MasterVisualizer
        activeVisualizers={activeVisualizers}
        waveColor={waveColor}
        frequencyColor={frequencyColor}
        volumeColor={volumeColor} // Neue Prop
        showBackgroundVideo={showBackgroundVideo} // Übergebe den Zustand
        isFrequencyCentered={isFrequencyCentered} // Neuer Zustand
        barWidth={barWidth} // Balkenbreite
        waveformThickness={waveformThickness} // Wellenlinien-Dicke
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
        waveformColor={waveColor} // Wellenfarbe übergeben
        handleWaveformColorChange={setWaveColor} // Wellenfarbe ändern
        frequencyColor={frequencyColor} // Frequenzfarbe übergeben
        handleFrequencyColorChange={handleFrequencyColorChange} // Frequenzfarbe ändern
        volumeColor={volumeColor} // Volume-Farbe hinzufügen
        handleVolumeColorChange={setVolumeColor} // State-Setter für Volume-Farbe
      />

      <DeviceSelector onDeviceSelect={setSelectedDevice} />
    </div>
  );
}

export default App;