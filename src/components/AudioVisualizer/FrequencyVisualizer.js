// src/components/AudioVisualizer/FrequencyVisualizer.js
export default function FrequencyVisualizer(canvas, analyser, dataArray, { frequencyColor }) {
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

  console.log('FrequencyVisualizer called with:', {
    canvas,
    analyser,
    dataArray,
    frequencyColor,
  });

  const canvasCtx = canvas.getContext('2d');
  analyser.getByteFrequencyData(dataArray);

  const barWidth = (canvas.width / dataArray.length) * 1.5; // Einmalige Berechnung
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 2;
    canvasCtx.fillStyle = frequencyColor || 'rgb(255, 0, 0)'; // Fallback-Farbe verwenden
    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
