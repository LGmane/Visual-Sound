// src/components/AppLogic/AudioContextProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AudioContext = createContext();

export function AudioContextProvider({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [visualizerType, setVisualizerType] = useState('frequency');

  useEffect(() => {
    console.log('AudioContextProvider initialized');
    console.log('State in Provider:', { selectedDevice, visualizerType });
  }, []);
  useEffect(() => {
    console.log('AudioContextProvider children:', children);
  }, []);
  useEffect(() => {
    console.log('Visualizer Type updated:', visualizerType);
  }, [visualizerType]);



  return (
    <AudioContext.Provider
      value={{
        selectedDevice, setSelectedDevice, visualizerType, setVisualizerType, setVisualizerType: (value) => {
          console.log('setVisualizerType called with:', value);
          setVisualizerType(value);
        },
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
