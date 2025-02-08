import React, { useState, useEffect } from "react";
import "../../styles/DeviceSelector.css";

function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceList.filter((device) => device.kind === "audioinput");
        setDevices(audioDevices);

        // Suche explizit nach Blackhole
        const blackholeDevice = audioDevices.find((device) => 
          device.label.toLowerCase().includes("blackhole")
        );

        // Falls Blackhole gefunden wird, automatisch auswählen, sonst erstes Gerät
        const defaultDevice = blackholeDevice || audioDevices[0];

        if (defaultDevice) {
          setSelectedDevice(defaultDevice.deviceId);
          onDeviceSelect(defaultDevice.deviceId);
        }
      } catch (error) {
        console.error("Error fetching audio devices:", error);
      }
    };

    fetchDevices();
  }, [onDeviceSelect]);

  const handleDeviceChange = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedDevice(selectedDeviceId);
    onDeviceSelect(selectedDeviceId);
  };

  return (
    <div className="device-selector">
      <label htmlFor="device-selector">Select Audio Input:</label>
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