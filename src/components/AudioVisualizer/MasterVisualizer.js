import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../AppLogic/AudioContextProvider';
import { Visualizers } from './configs';
import { setupAudio } from '../../utils/audioUtils';

function MasterVisualizer({ activeVisualizers, waveColor, frequencyColor }) {
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
      if (video) {
        await video.play().catch((error) => {
          console.error('Error attempting to play video:', error);
        });
      }

      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        const canvasCtx = canvas.getContext('2d');

        // Zeichne das Video als Hintergrund
        if (video && video.readyState >= 2) {
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Zeichne die aktiven Visualizer
        activeVisualizers.forEach((visualizerType) => {
          if (Visualizers[visualizerType]) {
            Visualizers[visualizerType](canvas, analyser, dataArray, {
              waveColor,
              frequencyColor,
            });
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
  }, [selectedDevice, activeVisualizers, waveColor, frequencyColor]);

  return (
    <div className="visualizer-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        onLoadedData={() => console.log('Video loaded and ready to play')}
        style={{ display: 'none' }}
        src={require('../../assets/videos/Background.mp4')} // Importiere das Video
      />
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        style={{ border: '1px solid white', marginTop: '10px' }}
      ></canvas>
    </div>
  );
}

export default MasterVisualizer;
