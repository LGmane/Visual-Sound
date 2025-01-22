// src/components/AppLogic/DeviceSelector.js
import React, { useEffect, useState } from 'react';

function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function fetchDevices() {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter((device) => device.kind === 'audioinput');
      setDevices(audioInputs);
    }
    fetchDevices();
  }, []);

  return (
    <div>
      <label htmlFor="device-selector">Select Audio Input:</label>
      <select id="device-selector" onChange={(e) => onDeviceSelect(e.target.value)}>
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
