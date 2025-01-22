// src/App.js
import React, { useContext } from 'react';
import { AudioContext } from './components/AppLogic/AudioContextProvider';
import DeviceSelector from './components/AppLogic/DeviceSelector';
import VisualizerSelector from './components/AppLogic/VisualizerSelector';
import MasterVisualizer from './components/AudioVisualizer/MasterVisualizer';

function App() {
  const context = useContext(AudioContext);
  console.log('AudioContext in App:', context);

  if (!context) {
    console.error('AudioContext is undefined. Ensure AudioContextProvider wraps the component tree.');
    return <div>Error: AudioContext is not available.</div>;
  }

  const { visualizerType, setVisualizerType, selectedDevice, setSelectedDevice } = context;

  return (
    <div>
      <h1>Visual Sound</h1>
      <DeviceSelector onDeviceSelect={setSelectedDevice} />
      <VisualizerSelector
        visualizerType={visualizerType}
        onChange={setVisualizerType}
      />
      <MasterVisualizer />
    </div>
  );
}

export default App;


