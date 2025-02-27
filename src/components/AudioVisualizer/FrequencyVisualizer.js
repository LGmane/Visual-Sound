// src/components/AudioVisualizer/FrequencyVisualizer.js - Visualisiert die Frequenzspektren als Balkendiagramm im Canvas

/**
 * 🎚 FrequencyVisualizer: Visualisiert Frequenzspektren als dynamische Balken im Canvas.
 * Unterstützt zentrierte Darstellung und passt sich proportional an die Canvas-Größe an.
 */

export default function FrequencyVisualizer(
  canvas,
  analyser,
  dataArray,
  { frequencyColor = 'rgb(255, 0, 0)', centered = false, barWidth = 2, scale = 1 }
) {
  
  // 🛠 Validierungen: Überprüfen der Eingabewerte
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

  // 🧮 Berechnung der Frequenzgrenzen
  const nyquist = analyser.context.sampleRate / 2; // Maximal darstellbare Frequenz (z. B. 22.050 Hz)
  const maxFrequency = 20000; // Obergrenze für den Visualizer

  // Berechnung des maximalen Index für 20.000 Hz
  const maxIndex = Math.floor((maxFrequency / nyquist) * dataArray.length);

  // Berechnung der Anzahl der Balken basierend auf der Canvas-Breite und der Balkenbreite
  const scaledBarWidth = barWidth * scale;
  const numberOfBars = Math.min(Math.floor(width / (scaledBarWidth + 1)), maxIndex);
  const step = Math.ceil(maxIndex / numberOfBars);

  let x = 0; // Startposition der Balken

  canvasCtx.clearRect(0, 0, width, height);

  // 🎨 Zeichnet die Frequenzbalken auf das Canvas
  for (let i = 0; i < maxIndex; i += step) {
    const amplitude = dataArray[i] / 255.0;
    const barHeight = amplitude * height * 0.8; // Höhe der Balken basierend auf dem Frequenzwert
    
    canvasCtx.fillStyle = frequencyColor; // Dynamische Farbe

    if (centered) {
      // 🧭 Zentrierter Modus: Zeichnet die Balken nach oben und unten
      const centerY = height / 2;
      canvasCtx.fillRect(x, centerY - barHeight, scaledBarWidth, barHeight);
      canvasCtx.fillRect(x, centerY, scaledBarWidth, barHeight);
    } else {
      // ⬆️ Standard-Modus: Zeichnet die Balken von unten nach oben
      canvasCtx.fillRect(x, height - barHeight, scaledBarWidth, barHeight);
    }

    x += scaledBarWidth + 1; // Abstand zwischen den Balken
  }
}
