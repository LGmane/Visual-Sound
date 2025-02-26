// src/components/AudioVisualizer/FrequencyVisualizer.js - Visualisiert die Frequenzspektren als Balkendiagramm im Canvas

export default function FrequencyVisualizer(
  canvas,
  analyser,
  dataArray,
  { frequencyColor, centered = false, barWidth = 2 }
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

  // 🎧 Holt die Frequenzdaten vom Analyser
  analyser.getByteFrequencyData(dataArray);

  // 🧮 Berechnung der Anzahl der Balken basierend auf der Canvas-Breite und der Balkenbreite
  const numberOfBars = Math.floor(canvas.width / (barWidth + 1));
  const step = Math.ceil(dataArray.length / numberOfBars);

  let x = 0; // Startposition der Balken

  // 🎨 Zeichnet die Frequenzbalken auf das Canvas
  for (let i = 0; i < dataArray.length; i += step) {
    const barHeight = dataArray[i] / 2; // Höhe der Balken basierend auf dem Frequenzwert
    canvasCtx.fillStyle = frequencyColor || 'rgb(255, 0, 0)'; // Standardfarbe: Rot

    if (centered) {
      // 🧭 Zentrierter Modus: Zeichnet die Balken nach oben und unten
      const centerY = canvas.height / 2;
      canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
      canvasCtx.fillRect(x, centerY, barWidth, barHeight);
    } else {
      // ⬆️ Standard-Modus: Zeichnet die Balken von unten nach oben
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    x += barWidth + 1; // Abstand zwischen den Balken
  }
}