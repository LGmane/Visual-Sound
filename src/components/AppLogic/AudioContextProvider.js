// src/components/AppLogic/AudioContextProvider.js - Sicherstellung, dass ein gültiges Audiogerät und Visualizer ausgewählt sind

import React, { createContext, useState, useEffect } from 'react';

// 🎧 Erstelle den globalen Audio-Kontext
export const AudioContext = createContext();

export function AudioContextProvider({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(null); 
  const [visualizerType, setVisualizerType] = useState('frequency'); 
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    console.log('AudioContextProvider initialized');
    console.log('Initial State:', { selectedDevice, visualizerType });
  }, []);

  useEffect(() => {
    console.log('Visualizer Type updated:', visualizerType);
    console.log('Selected Device:', selectedDevice);
  }, [visualizerType, selectedDevice]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceList = await navigator.mediaDevices.enumerateDevices();

        const audioDevices = deviceList.filter((device) => device.kind === 'audioinput');
        setDevices(audioDevices);

        // Wähle automatisch das erste verfügbare Gerät oder bevorzugt "Microphone"
        const defaultDevice = audioDevices.find((device) =>
          ["microphone", "cable input", "line in", "stereo mix"].some((keyword) =>
            device.label.toLowerCase().includes(keyword)
          )
        ) || audioDevices[0];

        if (defaultDevice) {
          console.log('Default Device Selected:', defaultDevice.label || defaultDevice.deviceId);
          setSelectedDevice(defaultDevice.deviceId);
        } else {
          console.warn('Kein gültiges Audiogerät gefunden!');
        }
      } catch (error) {
        console.error("Error fetching audio devices:", error);
      }
    };

    fetchDevices();
  }, []);

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
