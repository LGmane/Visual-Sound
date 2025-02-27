// src/components/AudioVisualizer/WaveformVisualizer.js - Zeichnet die Wellenform der Audiodaten im Canvas

/**
 * 🎵 WaveformVisualizer: Visualisiert die Audiodaten als weiche, skalierbare Wellenform im Canvas.
 * Nutzt proportionale Skalierung, um auch im Fullscreen-Modus konsistent auszusehen.
 */

export default function WaveformVisualizer(
  canvas, 
  analyser, 
  dataArray, 
  { waveColor = 'rgb(0, 255, 0)' }
) {

  // 🛠 Validierungen
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

  // 🖌 Stileinstellungen für die Wellenform mit Glow-Effekt
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = waveColor;
  canvasCtx.lineJoin = 'round';
  canvasCtx.lineCap = 'round';

  canvasCtx.shadowBlur = 15;
  canvasCtx.shadowColor = waveColor;

  canvasCtx.beginPath();

  const { width, height } = canvas;

  const sliceWidth = width / (dataArray.length - 1);
  let x = 0;

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

  canvasCtx.lineTo(width, height / 2);
  canvasCtx.stroke();

  canvasCtx.restore();
}
