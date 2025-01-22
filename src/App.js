// src/App.js
import React, { useContext, useState } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';

function App() {
  const { selectedDevice, setSelectedDevice } = useContext(AudioContext);

  // State für aktive Visualisierer
  const [activeVisualizers, setActiveVisualizers] = useState([]);

  // Funktion zum Umschalten eines Visualisierers
  const toggleVisualizer = (visualizerType) => {
    setActiveVisualizers((prev) =>
      prev.includes(visualizerType)
        ? prev.filter((type) => type !== visualizerType) // Deaktivieren
        : [...prev, visualizerType] // Aktivieren
    );
  };

  return (
    <div>
      <h1>Visual Sound</h1>
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
      <VisualizerSelector
        activeVisualizers={activeVisualizers}
        toggleVisualizer={toggleVisualizer}
      />
      <MasterVisualizer activeVisualizers={activeVisualizers} />
    </div>
  );
}

export default App;




