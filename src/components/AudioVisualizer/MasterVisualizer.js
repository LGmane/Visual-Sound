// src/components/AudioVisualizer/MasterVisualizer.js - Bereinigt: Frequency, Waveform, Circle und Oscilloscope Visualizer

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { setupAudio } from '../../utils/audioUtils';
import { Visualizers } from './configs';

function MasterVisualizer({
  selectedDevice,
  activeVisualizers,
  waveColor, // Nur Waveform nutzt den Colorpicker
  frequencyColor, // Dynamische Farbe für Frequency Visualizer
  isFrequencyCentered, // Zentrierungsoption für Frequency Visualizer
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      }
    }
  };

  const exitFullscreenHandler = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', exitFullscreenHandler);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      document.removeEventListener('fullscreenchange', exitFullscreenHandler);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

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

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = 'black';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        if (activeVisualizers.includes('frequency') && Visualizers['frequency']) {
          Visualizers['frequency'](canvas, analyser, dataArray, {
            frequencyColor,
            centered: isFrequencyCentered,
          });
        }

        if (activeVisualizers.includes('waveform') && Visualizers['waveform']) {
          Visualizers['waveform'](canvas, analyser, dataArray, {
            waveColor,
          });
        }

        if (activeVisualizers.includes('circle') && Visualizers['circle']) {
          Visualizers['circle'](canvas, analyser, dataArray, {
            waveColor: 'rgba(255, 255, 0, 0.7)',
          });
        }

        if (activeVisualizers.includes('oscilloscope') && Visualizers['oscilloscope']) {
          Visualizers['oscilloscope'](canvas, analyser, dataArray, {
            waveColor: 'rgba(255, 255, 255, 1.0)',
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
