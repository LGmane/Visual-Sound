// src/components/AudioVisualizer/MasterVisualizer.js - Diese Komponente rendert das Canvas für die Audio-Visualisierung und steuert den Fullscreen-Modus sowie die Hintergrundvideos.

import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../AppLogic/AudioContextProvider';
import { Visualizers } from './configs';
import { setupAudio } from '../../utils/audioUtils';

function MasterVisualizer({
  activeVisualizers,
  waveColor,
  frequencyColor,
  volumeColor,
  showBackgroundVideo,
  isFrequencyCentered,
  barWidth,
  waveformThickness,
  isFullscreen,
  onToggleFullscreen,
}) {
  const { selectedDevice } = useContext(AudioContext);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!selectedDevice) return;

    let animationActive = true;

    const initializeAudio = async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // 🎬 Hintergrundvideo vorbereiten
      if (video && showBackgroundVideo) {
        await video.play().catch((error) => {
          console.error('Error attempting to play video:', error);
        });
      }

      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        const canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        // 🖼 Hintergrundvideo oder schwarzes Fallback anzeigen
        if (video && showBackgroundVideo && video.readyState >= 2) {
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
          canvasCtx.fillStyle = 'black';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 🎨 Zeichne die aktiven Visualizer in der richtigen Reihenfolge
        if (activeVisualizers.includes('frequency') && Visualizers['frequency']) {
          Visualizers['frequency'](canvas, analyser, dataArray, {
            frequencyColor,
            centered: isFrequencyCentered,
            barWidth,
          });
        }

        if (activeVisualizers.includes('waveform') && Visualizers['waveform']) {
          Visualizers['waveform'](canvas, analyser, dataArray, {
            waveColor,
            thickness: waveformThickness,
          });
        }

        if (activeVisualizers.includes('volume') && Visualizers['volume']) {
          Visualizers['volume'](canvas, analyser, dataArray, {
            volumeColor,
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
    volumeColor,
    showBackgroundVideo,
    isFrequencyCentered,
    barWidth,
    waveformThickness,
  ]);

  // 🖥 Fullscreen-Funktionalität
  useEffect(() => {
    const container = containerRef.current;

    // Fullscreen-Modus aktivieren
    if (isFullscreen && container) {
      container.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } 
    // Fullscreen-Modus verlassen
    else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }

    // 📲 Event-Listener für Fullscreen-Änderungen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        onToggleFullscreen();
      }
    };

    window.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, onToggleFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`visualizer-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        style={{ display: 'none' }}
        src={require('../../assets/videos/Background.mp4')}
      />
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

      {/* 🔲 Button nur anzeigen, wenn nicht im Fullscreen-Modus */}
      {!isFullscreen && (
        <button
          className="fullscreen-button"
          onClick={onToggleFullscreen}
        >
          Fullscreen
        </button>
      )}
    </div>
  );
}

export default MasterVisualizer;