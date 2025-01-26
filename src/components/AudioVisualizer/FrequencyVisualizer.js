// src/components/AudioVisualizer/FrequencyVisualizer.js
export default function FrequencyVisualizer(canvas, analyser, dataArray, { frequencyColor, centered = false }) {
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

  const barWidth = (canvas.width / dataArray.length) * 1.5; // Berechne Balkenbreite
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 2;
    canvasCtx.fillStyle = frequencyColor || 'rgb(255, 0, 0)'; // Standardfarbe

    if (centered) {
      // Mittig zentriert mit Spiegelung
      const centerY = canvas.height / 2;
      canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight); // Nach oben
      canvasCtx.fillRect(x, centerY, barWidth, barHeight); // Nach unten
    } else {
      // Standard unten
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    x += barWidth + 1;
  }
}
