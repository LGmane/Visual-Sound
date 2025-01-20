// Import necessary React hooks and utilities
import React, { useEffect, useState, useRef } from 'react';
//import { setupAudio } from '../utils/audioUtils'; // Utility for setting up audio
import {
  calculateVolume,
  calculatePeak,
} from '../utils/audioCalculations'; // Calculations for audio data
import {
  drawFrequencySpectrum,
  drawWaveform,
  drawWaveOnBeat,
} from '../utils/visualizerUtils'; // Visualizations

/**
 * AudioVisualizer Component
 * Manages the state, audio initialization, and rendering of visualizations.
 */
function AudioVisualizer() {
  // State for managing audio devices and the selected device
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // State to control animation
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for audio analyser, data arrays, and canvas
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);

  // Ref for animation frame ID
  const animationFrameRef = useRef(null);

  // Load available audio devices on component mount
  useEffect(() => {
    async function getAudioDevices() {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter((device) => device.kind === 'audioinput');
      setDevices(audioInputs);

      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId); // Default to the first device
      }
    }
    getAudioDevices();
  }, []);

  // Initialize audio when a device is selected
  useEffect(() => {
    // Ensure only one animation loop runs
    let animationActive = false;
  
    if (isAnimating) {
      console.log('Starting animation loop'); // Debugging
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      let volumePeak = 0;
  
      // Render function
      function renderFrame() {
        if (!animationActive) return; // Stop rendering if the animation is inactive
  
        // Clear canvas
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Calculate volume
        const volume = calculateVolume(dataArrayRef.current);
        volumePeak = calculatePeak(canvas.height * volume, volumePeak);
  
        // Draw visualizations
        drawWaveform(canvas, analyserRef.current, dataArrayRef.current);
        drawFrequencySpectrum(canvas, analyserRef.current);
        drawWaveOnBeat(canvasCtx, analyserRef.current);
  
        // Draw volume bar
        canvasCtx.fillStyle = 'rgb(0, 0, 255)';
        canvasCtx.fillRect(canvas.width - 50, canvas.height - canvas.height * volume, 30, canvas.height * volume);
  
        // Draw volume peak
        canvasCtx.fillStyle = 'rgb(0, 0, 255)';
        canvasCtx.fillRect(canvas.width - 50, canvas.height - volumePeak - 5, 30, 5);
  
        // Schedule next frame
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
  
      // Activate animation
      animationActive = true;
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    } else {
      console.log('Stopping animation loop'); // Debugging
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  
    // Cleanup on unmount
    return () => {
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAnimating]);
  
  

  // Function to start visualizations
  function startVisualizations() {
    setIsAnimating(true);
  }

  // Function to stop visualizations
  function stopVisualizations() {
    setIsAnimating(false);
  }

  return (
    <div>
      <h1>Audio Visualizer</h1>
      <label htmlFor="audio-input">Select Audio Input:</label>
      <select
        id="audio-input"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '10px' }}>
        <button onClick={startVisualizations} style={{ marginRight: '5px' }}>
          Start
        </button>
        <button onClick={stopVisualizations}>Stop</button>
      </div>

      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        style={{ border: '1px solid white', marginTop: '10px' }}
      ></canvas>
    </div>
  );
}

export default AudioVisualizer;
