// src/components/AudioVisualizer/AudioVisualizer.js - Verwaltet die Audiogeräte, initialisiert den Audiostream und rendert Visualisierungen im Canvas

import React, { useEffect, useState, useRef } from 'react';
import { setupAudio } from '../utils/audioUtils'; // Hilfsfunktion zur Audiokonfiguration
import {
  calculateVolume,
  calculatePeak,
} from '../utils/audioCalculations'; // Berechnungen für Audioanalysen
import {
  drawFrequencySpectrum,
  drawWaveform,
} from '../utils/visualizerUtils'; // Funktionen zur Visualisierung

/**
 * 🎵 AudioVisualizer Komponente
 * Verwaltet den Zustand, initialisiert Audio und steuert die Visualisierungsfunktionen.
 */
function AudioVisualizer() {
  // 🎧 State für verfügbare Audiogeräte und ausgewähltes Gerät
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // 🎬 Steuert die Animation der Visualisierungen
  const [isAnimating, setIsAnimating] = useState(false);

  // 🧠 Refs für Audio-Analyser, Datenarrays und Canvas
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);

  // 🔁 Ref für die Animation-Frame-ID
  const animationFrameRef = useRef(null);

  // 📲 Lädt verfügbare Audiogeräte beim Komponentenmout
  useEffect(() => {
    async function getAudioDevices() {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter((device) => device.kind === 'audioinput');
      setDevices(audioInputs);

      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId); // Wählt standardmäßig das erste Gerät aus
      }
    }
    getAudioDevices();
  }, []);

  // 🎶 Initialisiert Audio, wenn ein Gerät ausgewählt wird
  useEffect(() => {
    if (!selectedDevice) return;

    async function initializeAudio() {
      const { analyser, dataArray } = await setupAudio(selectedDevice);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    }
    initializeAudio();
  }, [selectedDevice]);

  // 🎨 Verwaltet die Visualisierungen basierend auf dem `isAnimating` Zustand
  useEffect(() => {
    let animationActive = false; 

    if (isAnimating) {
      console.log('Animation started');
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      let volumePeak = 0;

      let lastRenderTime = 0;
      const targetFPS = 60; // Maximal 60 FPS

      // 🎬 Render-Funktion für die Animation
      function renderFrame(currentTime) {
        const timeSinceLastRender = currentTime - lastRenderTime;
        if (timeSinceLastRender < 1000 / targetFPS) {
          requestAnimationFrame(renderFrame);
          return;
        }
        lastRenderTime = currentTime;

        if (!animationActive) return; 

        // 🧹 Canvas bereinigen
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        // 📈 Berechnung der Lautstärke und des Peaks
        const volume = calculateVolume(dataArrayRef.current);
        volumePeak = calculatePeak(canvas.height * volume, volumePeak);

        // 🔈 Mindestlautstärkeschwelle
        const MIN_THRESHOLD = 10; 
        if (volume * 255 < MIN_THRESHOLD) { 
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height); 
          requestAnimationFrame(renderFrame);
          return;
        }

        // 🎨 Zeichnet die Visualisierungen
        drawFrequencySpectrum(canvas, analyserRef.current);
        drawWaveform(canvas, analyserRef.current, dataArrayRef.current);

        // 🎚 Zeichnet die Lautstärkenanzeige
        canvasCtx.fillStyle = 'rgb(0, 0, 255)';
        canvasCtx.fillRect(canvas.width - 50, canvas.height - canvas.height * volume, 30, canvas.height * volume);

        // 🎯 Zeichnet den Lautstärkenpeak
        canvasCtx.fillRect(canvas.width - 50, canvas.height - volumePeak - 5, 30, 5);

        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
      
      requestAnimationFrame(renderFrame);
      animationActive = true;

    } else {
      console.log('Animation stopped');
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } 

    // 🧼 Bereinigt Animationen beim Verlassen der Komponente
    return () => {
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAnimating]);

  // ▶️ Startet die Visualisierung
  function startVisualizations() {
    setIsAnimating(true);
  }

  // ⏹ Stoppt die Visualisierung
  function stopVisualizations() {
    setIsAnimating(false);
  }

  return (
    <div>
      <h1>Audio Visualizer</h1>
      
      {/* 🎙 Auswahl des Audioeingangs */}
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

      {/* 📺 Canvas zur Darstellung der Visualisierungen */}
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        style={{
          border: '1px solid white',
          marginTop: '10px',
          backgroundColor: 'black',
        }}
      ></canvas>
    </div>
  );
}

export default AudioVisualizer;