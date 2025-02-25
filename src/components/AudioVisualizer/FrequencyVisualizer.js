export default function FrequencyVisualizer(canvas, analyser, dataArray, { frequencyColor, centered = false, barWidth = 2 }) {
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

  // Breite der Balken durch `barWidth` steuern
  const numberOfBars = Math.floor(canvas.width / (barWidth + 1));
  const step = Math.ceil(dataArray.length / numberOfBars);

  console.log('Calculated barWidth:', barWidth, 'Number of bars:', numberOfBars);

  let x = 0;

  for (let i = 0; i < dataArray.length; i += step) {
    const barHeight = dataArray[i] / 2;
    canvasCtx.fillStyle = frequencyColor || 'rgb(0, 0, 0)';

    if (centered) {
      const centerY = canvas.height / 2;
      canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
      canvasCtx.fillRect(x, centerY, barWidth, barHeight);
    } else {
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    x += barWidth + 1;
  }
}