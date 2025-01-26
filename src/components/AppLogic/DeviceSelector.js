import React, { useState, useEffect } from 'react';
import '../../styles/DeviceSelector.css';

function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceList.filter((device) => device.kind === 'audioinput');
        setDevices(audioDevices);

        if (audioDevices.length > 0) {
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
    onDeviceSelect(selectedDeviceId);
  };

  return (
    <div className="device-selector">
      <label htmlFor="device-selector">Select Audio Input:</label>
      <select id="device-selector" onChange={handleDeviceChange}>
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