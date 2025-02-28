// src/components/AudioVisualizer/MasterVisualizer.js

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { setupAudio } from '../../utils/audioUtils';
import { Visualizers } from './configs';

function MasterVisualizer({
  selectedDevice,
  activeVisualizers,
  waveColor,
  frequencyColor,
  isFrequencyCentered,
  isFullscreen,
  onToggleFullscreen,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 🧮 Resizes the canvas to match the screen size and handles high DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = window.devicePixelRatio || 1;

      // Dynamische Berechnung der Bildschirmgröße unter Berücksichtigung der DPI
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Setze die Canvas-Größe für Retina-Displays
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
        ctx.scale(ratio, ratio);
      }
    }
  }, []);

  // 📏 Adds and removes event listeners for fullscreen and window resize events
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize to ensure canvas size on first render

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // 🎵 Initializes audio and handles rendering of active visualizers
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    // 🚫 No audio device selected or no visualizers active
    if (!selectedDevice || activeVisualizers.length === 0) {
      canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = 'black';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationActive = true;

    const initializeAudio = async () => {
      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        // 🖌 Clear canvas and set background
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = 'black';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;

        // 📊 Render Frequency Visualizer
        if (activeVisualizers.includes('frequency') && Visualizers['frequency']) {
          Visualizers['frequency'](canvas, analyser, dataArray, {
            frequencyColor,
            centered: isFrequencyCentered,
          });
        }

        // 🌊 Render Waveform Visualizer
        if (activeVisualizers.includes('waveform') && Visualizers['waveform']) {
          Visualizers['waveform'](canvas, analyser, dataArray, {
            waveColor,
          });
        }

        // 🎡 Render Circle Visualizer
        if (activeVisualizers.includes('circle') && Visualizers['circle']) {
          Visualizers['circle'](canvas, analyser, dataArray, {
            waveColor: 'rgba(255, 255, 0, 0.7)',
            centerX,
            centerY,
          });
        }

        // 🎱 Render Ball Visualizer
        if (activeVisualizers.includes('ball') && Visualizers['ball']) {
          Visualizers['ball'](canvas, analyser, dataArray, {
            waveColor: 'rgba(255, 255, 255, 1.0)',
            centerX,
            centerY,
          });
        }

        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    };

    initializeAudio();

    return () => {
      animationActive = false;
    };
  }, [
    selectedDevice,
    activeVisualizers,
    waveColor,
    frequencyColor,
    isFrequencyCentered,
  ]);

  return (
    <div ref={containerRef} className="visualizer-container">
      <canvas ref={canvasRef} className="visualizer-canvas"></canvas>

      {!isFullscreen && (
        <button className="fullscreen-button" onClick={onToggleFullscreen}>
          ⛶
        </button>
      )}
    </div>
  );
}

export default MasterVisualizer;
