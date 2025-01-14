import React, { useEffect, useState, useRef } from 'react';
import { setupAudio } from '../utils/audioUtils'; // Utility for setting up audio
import {
  calculateVolume,
  calculateEnergyLevel,
  calculatePeak,
} from '../utils/audioCalculations'; // Calculations for audio data
import {
  drawWaveform,
  drawFrequencySpectrum,
  drawWaveOnBeat,
  drawBassImpact,
} from '../utils/visualizerUtils'; // Visualizations

function AudioVisualizer() {
  // State to manage available audio devices and the selected device
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Refs to store audio analyser, data arrays, and canvas reference
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);

  // Load audio input devices on component mount
  useEffect(() => {
    async function getAudioDevices() {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter(device => device.kind === 'audioinput');
      setDevices(audioInputs);

      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId); // Default to the first device
      }
    }

    getAudioDevices();
  }, []);

  // Initialize audio when a device is selected
  useEffect(() => {
    if (!selectedDevice) return;

    async function initializeAudio() {
      const { analyser, dataArray } = await setupAudio(selectedDevice);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      // Start visualization functions
      startVisualizations();
    }

    initializeAudio();
  }, [selectedDevice]);

  /**
   * Starts the visualizations by invoking all drawing functions.
   */
  function startVisualizations() {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    let volumePeak = 0;
    let energyPeak = 0;

    // Main visualizations
    function renderFrame() {
      requestAnimationFrame(renderFrame);

      // Clear canvas
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate volume and energy
      const volume = calculateVolume(dataArrayRef.current);
      const energyLevel = calculateEnergyLevel(dataArrayRef.current);

      // Update peaks
      volumePeak = calculatePeak(canvas.height * volume, volumePeak);
      energyPeak = calculatePeak(canvas.height * energyLevel, energyPeak);

      // Draw the waveform
      drawWaveform(canvas, analyserRef.current, dataArrayRef.current);

      // Draw the frequency spectrum
      drawFrequencySpectrum(canvas, analyserRef.current);

      // Draw volume bar
      canvasCtx.fillStyle = 'rgb(0, 0, 255)';
      canvasCtx.fillRect(canvas.width - 50, canvas.height - canvas.height * volume, 30, canvas.height * volume);

      // Draw volume peak
      canvasCtx.fillStyle = 'rgb(255, 255, 0)';
      canvasCtx.fillRect(canvas.width - 50, canvas.height - volumePeak - 5, 30, 5);

      // Draw energy bar
      canvasCtx.fillStyle = 'rgb(0, 0, 255)';
      canvasCtx.fillRect(canvas.width - 90, canvas.height - canvas.height * energyLevel, 30, canvas.height * energyLevel);

      // Draw energy peak
      canvasCtx.fillStyle = 'rgb(0, 0, 255)';
      canvasCtx.fillRect(canvas.width - 90, canvas.height - energyPeak - 5, 30, 5);
    }

    // Start the visualizations
    renderFrame();

    // Additional animations
    drawWaveOnBeat(canvasCtx, analyserRef.current);
    drawBassImpact(canvasCtx, analyserRef.current);
  }

  // --- Render the component --- //
  return (
    <div>
      <h1>Audio Visualizer</h1>
      <label htmlFor="audio-input">Select Audio Input:</label>
      <select
        id="audio-input"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>

      <canvas ref={canvasRef} width="800" height="400" style={{ border: '1px solid white' }}></canvas>
    </div>
  );
}

export default AudioVisualizer;
