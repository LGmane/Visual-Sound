// src/components/AppLogic/AudioContextProvider.js - Ensures a valid audio device and visualizer are selected

import React, { createContext, useState, useEffect } from 'react';

// 🎧 Creates the global audio context
export const AudioContext = createContext();

export function AudioContextProvider({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(null); // 🎯 Currently selected audio device ID
  const [visualizerType, setVisualizerType] = useState('frequency'); // 📊 Default visualizer type
  const [, setDevices] = useState([]); // 📱 List of available audio devices

  // 🔍 Logs the initial state when the provider is initialized
  useEffect(() => {
    console.log('AudioContextProvider initialized');
    console.log('Initial State:', { selectedDevice, visualizerType });
  }, []); // Only runs once when the component mounts

  // 🔄 Logs changes to the selected device or visualizer type
  useEffect(() => {
    console.log('Visualizer Type updated:', visualizerType);
    console.log('Selected Device:', selectedDevice);
  }, [visualizerType, selectedDevice]); // Added selectedDevice as dependency

  // 🎧 Fetches available audio input devices and handles device changes
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // 🆕 Requests permission for audio input
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceList = await navigator.mediaDevices.enumerateDevices();

        // 🎯 Filters only audio input devices
        const audioDevices = deviceList.filter((device) => device.kind === 'audioinput');
        setDevices(audioDevices);

        // 🚦 Automatically selects the first available device or prefers "Microphone"
        const defaultDevice = audioDevices.find((device) =>
          ["microphone", "cable input", "line in", "stereo mix"].some((keyword) =>
            device.label.toLowerCase().includes(keyword)
          )
        ) || audioDevices[0];

        if (defaultDevice) {
          console.log('Default Device Selected:', defaultDevice.label || defaultDevice.deviceId);
          setSelectedDevice(defaultDevice.deviceId);
        } else {
          console.warn('No valid audio device found!');
        }
      } catch (error) {
        console.error("Error fetching audio devices:", error);
      }
    };

    fetchDevices();
  }, []); // No changes needed here, runs once on mount

  // 🆕 Re-initialize audio stream when selected device changes
  useEffect(() => {
    if (selectedDevice) {
      console.log('Re-initializing audio stream for device:', selectedDevice);
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: selectedDevice } })
        .then((stream) => {
          console.log('Audio stream initialized for new device');
        })
        .catch((error) => {
          console.error('Failed to initialize audio stream for new device:', error);
        });
    }
  }, [selectedDevice]); // Triggers on device change

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
