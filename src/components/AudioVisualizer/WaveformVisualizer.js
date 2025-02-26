// src/components/AudioVisualizer/WaveformVisualizer.js - Zeichnet die Wellenform der Audiodaten im Canvas

export default function WaveformVisualizer(canvas, analyser, dataArray, { waveColor, thickness = 2 }) {
  
  // 🛠 Validierungen: Überprüfen, ob die Eingaben korrekt sind
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

  // 🎧 Holt die aktuellen Audiodaten
  analyser.getByteTimeDomainData(dataArray);

  // 🖌 Stileinstellungen für die Wellenform
  canvasCtx.lineWidth = thickness; // Linienbreite setzen
  canvasCtx.strokeStyle = waveColor || 'rgb(0, 255, 0)'; // Standardfarbe: Grün
  canvasCtx.beginPath();

  // 🧮 Berechnung der Abstände zwischen den Punkten
  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;

  // 🎨 Zeichnet die Wellenform basierend auf den Audiodaten
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0; // Normalisierung der Werte (0 bis 255 → ~0 bis 2)
    const y = (v * canvas.height) / 2; // Skalierung auf Canvas-Höhe

    if (i === 0) {
      canvasCtx.moveTo(x, y); // Startpunkt setzen
    } else {
      canvasCtx.lineTo(x, y); // Linien zum nächsten Punkt ziehen
    }

    x += sliceWidth;
  }

  // 🚦 Schließt die Linie mittig ab
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}