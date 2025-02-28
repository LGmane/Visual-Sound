// src/components/AudioVisualizer/FrequencyVisualizer.js - Visualizes the frequency spectrum as a bar chart on the canvas

/**
 * 📊 FrequencyVisualizer: Visualizes frequency spectrums as dynamic bars on a canvas.
 * Supports centered display and proportionally adapts to the canvas size.
 */

export default function FrequencyVisualizer(
  canvas,
  analyser,
  dataArray,
  { frequencyColor = 'rgb(255, 0, 0)', centered = false, scale = 1 }
) {

  // 🛠 Validation Checks
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('FrequencyVisualizer: Invalid canvas element');
    return;
  }
  if (typeof analyser.getByteFrequencyData !== 'function') {
    console.error('FrequencyVisualizer: Invalid analyser node');
    return;
  }
  if (!(dataArray instanceof Uint8Array)) {
    console.error('FrequencyVisualizer: dataArray must be an instance of Uint8Array');
    return;
  }

  const canvasCtx = canvas.getContext('2d');
  analyser.getByteFrequencyData(dataArray);

  const { width, height } = canvas;

  // 🧮 Calculate Nyquist frequency and maximum index for frequency display
  const nyquist = analyser.context.sampleRate / 2; 
  const maxFrequency = 20000; 
  const maxIndex = Math.floor((maxFrequency / nyquist) * dataArray.length);

  // 🎯 Dynamic calculation of the bar width based on canvas size
  const barWidth = width / maxIndex; 
  let x = 0;

  canvasCtx.clearRect(0, 0, width, height);

  // 🛠️ No glow effect for the Frequency Visualizer
  canvasCtx.shadowBlur = 0; 
  canvasCtx.shadowColor = 'transparent';

  // 📊 Draws the frequency bars on the canvas
  for (let i = 0; i < maxIndex; i++) {
    const amplitude = dataArray[i] / 255.0;
    const barHeight = amplitude * height * 0.8; 
    
    canvasCtx.fillStyle = frequencyColor;

    if (centered) {
      const centerY = height / 2;
      canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
      canvasCtx.fillRect(x, centerY, barWidth, barHeight);
    } else {
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
    }

    x += barWidth; 
  }
}
