// src/components/AudioVisualizer/MasterVisualizer.js - Leert das Canvas, wenn kein Visualizer aktiv ist

import React, { useEffect, useRef } from 'react';
import { setupAudio } from '../../utils/audioUtils';
import { Visualizers } from './configs';

function MasterVisualizer({
  selectedDevice,
  activeVisualizers,
  waveColor,
  frequencyColor,
  isFrequencyCentered,
  barWidth,
  waveformThickness,
  isFullscreen,
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    // 🧹 Leert das Canvas, wenn kein Visualizer aktiv ist
    if (!selectedDevice || activeVisualizers.length === 0) {
      console.log('Kein Visualizer aktiv oder kein Gerät ausgewählt.');
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = 'black'; // 🖤 Schwarzer Hintergrund
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    console.log('Aktive Visualizer:', activeVisualizers);

    let animationActive = true;

    const initializeAudio = async () => {
      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = 'black'; // 🖤 Schwarzer Hintergrund immer als Standard
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const baseWidth = 800;
        const baseHeight = 400;
        const scaleFactor = Math.min(canvas.width / baseWidth, canvas.height / baseHeight);

        // 🎵 Frequenzvisualisierung
        if (activeVisualizers.includes('frequency') && Visualizers['frequency']) {
          console.log('Zeige Frequency Visualizer');
          Visualizers['frequency'](canvas, analyser, dataArray, {
            frequencyColor,
            centered: isFrequencyCentered,
            barWidth: barWidth * scaleFactor,
          });
        }

        // 🌊 Wellenformvisualisierung
        if (activeVisualizers.includes('waveform') && Visualizers['waveform']) {
          console.log('Zeige Waveform Visualizer');
          Visualizers['waveform'](canvas, analyser, dataArray, {
            waveColor,
            thickness: waveformThickness * scaleFactor,
          });
        }

        // 🔵 CircleVisualizer
        if (activeVisualizers.includes('circle') && Visualizers['circle']) {
          console.log('Zeige Circle Visualizer');
          Visualizers['circle'](canvas, analyser, dataArray, {
            waveColor,
            thickness: 2,
            amplitudeMultiplier: 5000,
            amplitudeBoost: 5,
            scale: 1,
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
    barWidth,
    waveformThickness,
  ]);

  return (
    <div ref={containerRef} className="visualizer-container">
      <canvas
        ref={canvasRef}
        width={isFullscreen ? window.innerWidth : 800}
        height={isFullscreen ? window.innerHeight : 400}
        style={{
          width: '100%',
          height: '100%',
          border: isFullscreen ? 'none' : '1px solid white',
          backgroundColor: 'black',
        }}
      ></canvas>
    </div>
  );
}

export default MasterVisualizer;
