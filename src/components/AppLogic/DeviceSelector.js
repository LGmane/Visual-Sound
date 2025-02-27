// src/components/AppLogic/DeviceSelector.js - Bevorzugt Mikrofon als Standardgerät und zeigt alle verfügbaren Audioeingabegeräte an

import React, { useState, useEffect } from "react";
import "../../styles/App.css";

/**
 * 🎙️ DeviceSelector Komponente
 * Bietet eine Dropdown-Liste zur Auswahl des Audioeingabegeräts.
 * Bevorzugt automatisch das Mikrofon, falls verfügbar.
 * 
 * @param {Function} onDeviceSelect - Callback-Funktion zur Übergabe des ausgewählten Geräte-ID
 */
function DeviceSelector({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]); // 📱 Verfügbare Audiogeräte
  const [selectedDevice, setSelectedDevice] = useState(""); // 🎯 Aktuell ausgewähltes Gerät

  // 🔄 Lädt verfügbare Audioeingabegeräte bei Komponentenmout
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceList = await navigator.mediaDevices.enumerateDevices();

        // 🎧 Filtert nur Audioeingabegeräte heraus
        const audioDevices = deviceList.filter((device) => device.kind === "audioinput");
        setDevices(audioDevices);

        // 🔍 Bevorzugt automatisch ein Mikrofon-Gerät, falls vorhanden
        const microphoneDevice = audioDevices.find((device) =>
          device.label.toLowerCase().includes("microphone")
        );

        // 🚦 Setzt entweder das Mikrofon oder das erste verfügbare Gerät als Standard
        const defaultDevice = microphoneDevice || audioDevices[0];

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

  // 🆕 Verarbeitet Änderungen in der Geräteauswahl
  const handleDeviceChange = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedDevice(selectedDeviceId);
    onDeviceSelect(selectedDeviceId);
  };

  return (
    <div className="device-selector">
      <label htmlFor="device-selector">Select Audio Input:</label>
      
      {/* 🎛️ Dropdown-Liste für verfügbare Audiogeräte */}
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
