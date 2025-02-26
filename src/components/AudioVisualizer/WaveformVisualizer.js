// src/components/AudioVisualizer/WaveformVisualizer.js - Zeichnet die Wellenform der Audiodaten im Canvas

/**
 * 🎵 WaveformVisualizer: Visualisiert die Audiodaten als weiche, skalierbare Wellenform im Canvas.
 * Nutzt proportionale Skalierung, um auch im Fullscreen-Modus konsistent auszusehen.
 */

export default function WaveformVisualizer(canvas, analyser, dataArray, { waveColor = 'rgb(0, 255, 0)', thickness = 2, scale = 1 }) {

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
  analyser.getByteTimeDomainData(dataArray);

  // 🖌 Stileinstellungen für die Wellenform
  canvasCtx.lineWidth = thickness * scale; // Linienbreite skaliert mit dem Canvas
  canvasCtx.strokeStyle = waveColor;
  canvasCtx.lineJoin = 'round';
  canvasCtx.lineCap = 'round';
  canvasCtx.beginPath();

  const { width, height } = canvas;

  // 🧮 Berechnung der Abstände zwischen den Punkten
  const sliceWidth = (width / dataArray.length) * scale;
  let x = 0;

  // 🎨 Zeichnet die Wellenform basierend auf den Audiodaten
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0; // Normalisierung der Werte (0 bis 255 → ~0 bis 2)
    const y = (v * height) / 2; // Skalierung auf Canvas-Höhe

    if (i === 0) {
      canvasCtx.moveTo(x, y); // Startpunkt setzen
    } else {
      canvasCtx.lineTo(x, y); // Linien zum nächsten Punkt ziehen
    }

    x += sliceWidth;
  }

  // 🚦 Schließt die Linie mittig ab
  canvasCtx.lineTo(width, height / 2);
  canvasCtx.stroke();
}