// src/components/AppLogic/AudioContextProvider.js - Stellt den globalen Audiokontext bereit und verwaltet den Zustand des ausgewählten Audiogeräts und des Visualizer-Typs

import React, { createContext, useState, useEffect } from 'react';

// 🎧 Erstelle den globalen Audio-Kontext
export const AudioContext = createContext();

/**
 * 🌐 AudioContextProvider
 * Bietet den globalen Zustand für ausgewähltes Audiogerät und den aktuellen Visualizer-Typ.
 * 
 * @param {ReactNode} children - Die verschachtelten Komponenten, die Zugriff auf den Kontext benötigen
 */
export function AudioContextProvider({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(null); // 🎙️ Ausgewähltes Audiogerät
  const [visualizerType, setVisualizerType] = useState('frequency'); // 🎨 Standard-Visualizer ist 'frequency'

  // 🛠️ Debugging: Initialisierung des Providers
  useEffect(() => {
    console.log('AudioContextProvider initialized');
    console.log('Initial State:', { selectedDevice, visualizerType });
  }, []);

  // 🆕 Debugging: Überwachung des ausgewählten Audiogeräts
  useEffect(() => {
    if (selectedDevice) {
      console.log('Selected Device updated:', selectedDevice);
    }
  }, [selectedDevice]);

  // 🆕 Debugging: Überwachung des Visualizer-Typs
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