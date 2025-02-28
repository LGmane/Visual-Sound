// src/components/AppLogic/DeviceSelector.js - Prefers Microphone, Cable Input, Line In, or default audio device

import React, { useState, useEffect } from "react";
import "../../styles/App.css";

/**
 * 🎙️ DeviceSelector Component
 * Provides a dropdown list to select the audio input device.
 * Automatically prefers a Microphone, Cable Input, Line In, or the first available device.
 * 
 * @param {Function} onDeviceSelect - Callback function to pass the selected device ID
 */
function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]); // 📱 Available audio devices
  const [selectedDevice, setSelectedDevice] = useState(""); // 🎯 Currently selected device

  // 🔄 Loads available audio input devices when the component mounts
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // 🆕 Requests permissions for audio input
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceList = await navigator.mediaDevices.enumerateDevices();

        // 🎧 Filters only audio input devices
        const audioDevices = deviceList.filter((device) => device.kind === "audioinput");
        setDevices(audioDevices);

        // 🔍 Prefers specific devices in the order: Microphone, Cable Input, Line In, Default device
        const preferredDevice = audioDevices.find((device) =>
          ["microphone", "cable input", "line in", "stereo mix"].some((keyword) =>
            device.label.toLowerCase().includes(keyword)
          )
        );

        // 🚦 Sets either the preferred device or the first available device as the default
        const defaultDevice = preferredDevice || audioDevices[0];

        if (defaultDevice) {
          setSelectedDevice(defaultDevice.deviceId);
          onDeviceSelect(defaultDevice.deviceId);
        }
      } catch (error) {
        console.error("Error fetching audio devices:", error);
      }
    };

    fetchDevices();

    // ⏲️ Optionally updates the device list every 5 seconds
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
    
  }, [onDeviceSelect]);

  // 🆕 Handles changes in the selected device
  const handleDeviceChange = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedDevice(selectedDeviceId);
    onDeviceSelect(selectedDeviceId);
  };

  return (
    <div className="device-selector">
      <label htmlFor="device-selector">Select Audio Input:</label>
      
      {/* 🎛️ Dropdown list for available audio devices */}
      <select id="device-selector" value={selectedDevice} onChange={handleDeviceChange}>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DeviceSelector;
