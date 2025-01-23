// src/components/AppLogic/DeviceSelector.js
import React, { useState, useEffect } from 'react';

function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
        setDevices(audioDevices);

        if (audioDevices.length > 0) {
          console.log('Automatically selecting the first device:', audioDevices[0].deviceId);
          onDeviceSelect(audioDevices[0].deviceId); // Automatische Auswahl des ersten Geräts
        }
      } catch (error) {
        console.error('Error fetching audio devices:', error);
      }
    };

    fetchDevices();
  }, [onDeviceSelect]);

  const handleDeviceChange = (event) => {
    const selectedDeviceId = event.target.value;
    console.log('User selected device ID:', selectedDeviceId);
    onDeviceSelect(selectedDeviceId);
  };

  return (
    <div>
      <h3>Select Audio Input:</h3>
      <label htmlFor="device-selector"></label>
      <select id="device-selector" onChange={handleDeviceChange}>
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DeviceSelector;

