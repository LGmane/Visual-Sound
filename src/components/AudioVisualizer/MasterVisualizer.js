// src/components/AudioVisualizer/MasterVisualizer.js - Manages Frequency, Waveform, Circle, and Ball Visualizers

/**
 * 🎛️ MasterVisualizer: Combines and manages all available audio visualizers on a single canvas.
 * Renders the Frequency, Waveform, Circle, and Ball visualizers based on user selection.
 * Supports dynamic color, centering, and fullscreen mode for an immersive audio-visual experience.
 * Automatically handles canvas resizing and maintains smooth animations.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { setupAudio } from '../../utils/audioUtils';
import { Visualizers } from './configs';

function MasterVisualizer({
  selectedDevice,
  activeVisualizers,
  waveColor, // 🎨 Color for Waveform Visualizer
  frequencyColor, // 📊 Dynamic color for Frequency Visualizer
  isFrequencyCentered, // 📊 Centering option for Frequency Visualizer
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🧮 Resizes the canvas to match the screen size and handles high DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
      }
    }
  }, []);

  // ⛶ Toggles fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    }
  };

  // 🚦 Handles exit from fullscreen mode
  const exitFullscreenHandler = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

  // 📏 Adds and removes event listeners for fullscreen and window resize events
  useEffect(() => {
    document.addEventListener('fullscreenchange', exitFullscreenHandler);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      document.removeEventListener('fullscreenchange', exitFullscreenHandler);
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
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          ⛶
        </button>
      )}
    </div>
  );
}

export default MasterVisualizer;
