// src/components/AudioVisualizer/WaveformVisualizer.js
export default function WaveformVisualizer(canvas, analyser, dataArray, { waveColor }) {
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

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = waveColor || 'rgb(0, 255, 0)'; // Fallback-Farbe verwenden
  canvasCtx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}



  