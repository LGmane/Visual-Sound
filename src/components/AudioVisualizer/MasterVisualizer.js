// src/components/AudioVisualizer/MasterVisualizer.js
import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../AppLogic/AudioContextProvider';
import { Visualizers } from './configs';
import { setupAudio } from '../../utils/audioUtils';

function MasterVisualizer({
  activeVisualizers,
  waveColor,
  frequencyColor,
  volumeColor, // Neu hinzugefügt
  showBackgroundVideo,
  isFrequencyCentered,
  barWidth,
  waveformThickness,
}) {
  const { selectedDevice } = useContext(AudioContext);
  const canvasRef = useRef(null);
  const videoRef = useRef(null); // Ref für das Video

  useEffect(() => {
    if (!selectedDevice) return;

    let animationActive = true;

    const initializeAudio = async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Warte, bis das Video geladen ist
      if (video && showBackgroundVideo) {
        await video.play().catch((error) => {
          console.error('Error attempting to play video:', error);
        });
      }

      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        const canvasCtx = canvas.getContext('2d');

        // 1. Zeichne das Hintergrundvideo, wenn es aktiviert ist
        if (video && showBackgroundVideo && video.readyState >= 2) {
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
          // Fallback: Schwarz zeichnen
          canvasCtx.fillStyle = 'black';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Zeichne die aktiven Visualizer
        activeVisualizers.forEach((visualizerType) => {
          if (Visualizers[visualizerType]) {
            const options = {
              waveColor,
              frequencyColor,
              volumeColor, // Übergibt die Farbe für den VolumeVisualizer
              centered: visualizerType === 'frequency' && isFrequencyCentered,
              barWidth,
              thickness: waveformThickness,
            };

            // Ruft den entsprechenden Visualizer auf
            Visualizers[visualizerType](canvas, analyser, dataArray, options);
          }
        });

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
    volumeColor, // Neu hinzugefügt
    showBackgroundVideo,
    isFrequencyCentered,
    barWidth,
    waveformThickness,
  ]);

  return (
    <div className="visualizer-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        style={{ display: 'none' }}
        src={require('../../assets/videos/Background.mp4')} // Importiere das Video
      />
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        align="center"
        style={{ marginTop: '10px' }}
      ></canvas>
    </div>
  );
}

export default MasterVisualizer;