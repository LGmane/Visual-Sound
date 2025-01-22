// src/components/AudioVisualizer/MasterVisualizer.js
import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../AppLogic/AudioContextProvider';
import { Visualizers } from './configs';
import { setupAudio } from '../../utils/audioUtils';

function MasterVisualizer() {
  const { selectedDevice, visualizerType } = useContext(AudioContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('MasterVisualizer - selectedDevice:', selectedDevice);
    console.log('MasterVisualizer - visualizerType:', visualizerType);

    let animationActive = true;

    const initializeAudio = async () => {
      if (!selectedDevice) {
        console.error('No device selected. Cannot initialize audio.');
        return;
      }

      console.log('Initializing audio for device:', selectedDevice);

      const canvas = canvasRef.current;
      const { analyser, dataArray } = await setupAudio(selectedDevice);

      console.log('Audio setup complete. Analyser:', analyser);
      console.log('Data Array:', dataArray);

      const renderFrame = () => {
        if (!animationActive) return;

        console.log('Rendering frame for visualizerType:', visualizerType);

        const canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (Visualizers[visualizerType]) {
          console.log('Drawing visualizer for type:', visualizerType);
          Visualizers[visualizerType].draw(canvas, analyser, dataArray);
        } else {
          console.error('No visualizer found for type:', visualizerType);
        }

        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    };

    if (selectedDevice) {
      initializeAudio();
    }

    return () => {
      console.log('Cleaning up animation.');
      animationActive = false;
    };
  }, [selectedDevice, visualizerType]);

  return (
    <div>
      {selectedDevice ? (
        <canvas
          ref={canvasRef}
          width="800"
          height="400"
          style={{ border: '1px solid white', marginTop: '10px' }}
        ></canvas>
      ) : (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Please select an audio input device to start the visualizer.
        </p>
      )}
    </div>
  );
}

export default MasterVisualizer;

