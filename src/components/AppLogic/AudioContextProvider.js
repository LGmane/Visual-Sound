// src/components/AppLogic/AudioContextProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AudioContext = createContext();

export function AudioContextProvider({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [visualizerType, setVisualizerType] = useState('frequency');

  // Debugging Logs
  useEffect(() => {
    console.log('AudioContextProvider initialized');
    console.log('Initial State:', { selectedDevice, visualizerType });
  }, []);

  useEffect(() => {
    console.log('Selected Device updated:', selectedDevice);
  }, [selectedDevice]);

  useEffect(() => {
    console.log('Visualizer Type updated:', visualizerType);
  }, [visualizerType]);

  return (
    <AudioContext.Provider
      value={{
        selectedDevice,
        setSelectedDevice,
        visualizerType,
        setVisualizerType,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
