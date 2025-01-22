// src/components/AudioVisualizer/MasterVisualizer.js
import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../AppLogic/AudioContextProvider';
import { Visualizers } from './configs';
import { setupAudio } from '../../utils/audioUtils';

function MasterVisualizer({ activeVisualizers }) {
  const { selectedDevice } = useContext(AudioContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!selectedDevice) return;

    let animationActive = true;

    const initializeAudio = async () => {
      const canvas = canvasRef.current;
      const { analyser, dataArray } = await setupAudio(selectedDevice);

      const renderFrame = () => {
        if (!animationActive) return;

        const canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)'; // Schwarz als Hintergrund
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        activeVisualizers.forEach((visualizerType) => {
          if (Visualizers[visualizerType]) {
            Visualizers[visualizerType].draw(canvas, analyser, dataArray);
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
  }, [selectedDevice, activeVisualizers]);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="400"
      style={{ border: '1px solid white', marginTop: '10px' }}
    ></canvas>
  );
}

export default MasterVisualizer;

