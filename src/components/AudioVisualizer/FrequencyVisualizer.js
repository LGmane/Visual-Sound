// src/components/AudioVisualizer/FrequencyVisualizer.js - Visualisiert das Frequenzspektrum als Balkendiagramm im Canvas

/**
 * 🎚 FrequencyVisualizer: Visualisiert Frequenzspektren als dynamische Balken im Canvas.
 * Unterstützt zentrierte Darstellung und passt sich proportional an die Canvas-Größe an.
 */

export default function FrequencyVisualizer(
  canvas,
  analyser,
  dataArray,
  { frequencyColor = 'rgb(255, 0, 0)', centered = false, scale = 1 }
) {
  
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

  const nyquist = analyser.context.sampleRate / 2; 
  const maxFrequency = 20000; 
  const maxIndex = Math.floor((maxFrequency / nyquist) * dataArray.length);

  // 🎯 Berechnung der Balkenbreite dynamisch basierend auf der Canvas-Größe
  const barWidth = width / maxIndex; 
  let x = 0;

  canvasCtx.clearRect(0, 0, width, height);

  // 🎨 Zeichnet die Frequenzbalken auf das Canvas
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

    x += barWidth; // Automatische Füllung ohne Lücken
  }
}
