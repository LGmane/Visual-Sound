// src/components/AudioVisualizer/WaveformVisualizer.js - Renders the waveform of audio data on a canvas

/**
 * 🌊 WaveformVisualizer: Visualizes audio data as a smooth, scalable waveform on a canvas.
 * Uses proportional scaling to maintain consistency even in fullscreen mode.
 * Keeps the line stable when no audio is playing.
 */

export default function WaveformVisualizer(
  canvas, 
  analyser, 
  dataArray, 
  { waveColor = 'rgb(255, 0, 0)' }
) {

  // 🛠 Validation Checks
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('WaveformVisualizer: Invalid canvas element');
    return;
  }
  if (typeof analyser.getByteTimeDomainData !== 'function') {
    console.error('WaveformVisualizer: Invalid analyser node');
    return;
  }
  if (!(dataArray instanceof Uint8Array)) {
    console.error('WaveformVisualizer: dataArray must be an instance of Uint8Array');
    return;
  }

  const canvasCtx = canvas.getContext('2d');
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.save();

  // 🖌 Style settings for the waveform with a glow effect
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = waveColor;
  canvasCtx.lineJoin = 'round';
  canvasCtx.lineCap = 'round';

  canvasCtx.shadowBlur = 15;
  canvasCtx.shadowColor = waveColor;

  canvasCtx.beginPath();

  const { width, height } = canvas;

  // 🧮 Calculate slice width for waveform rendering
  const sliceWidth = width / (dataArray.length - 1);
  let x = 0;

  // 🌊 Check if the audio is silent
  const silenceThreshold = 2; // Tolerance for silence detection
  const isSilent = dataArray.every(value => Math.abs(value - 128) < silenceThreshold);

  if (isSilent) {
    // ➖ Draw a flat line in the middle if the audio is silent
    canvasCtx.moveTo(0, height / 2);
    canvasCtx.lineTo(width, height / 2);
  } else {
    // 🎶 Draw the waveform based on audio data
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0; 
      const y = (v * height) / 2; 

      if (i === 0) {
        canvasCtx.moveTo(x, y); 
      } else {
        canvasCtx.lineTo(x, y); 
      }

      x += sliceWidth;
    }
  }

  canvasCtx.stroke();
  canvasCtx.restore();
}
