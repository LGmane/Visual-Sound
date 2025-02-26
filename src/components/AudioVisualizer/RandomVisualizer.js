// src/components/AudioVisualizer/RandomVisualizer.js

/**
 * 🆕 RandomVisualizer: Zeichnet eine zufällige Wellenform basierend auf Audiodaten.
 * Ähnlich wie der WaveformVisualizer, jedoch mit zufälligen Verzerrungen.
 */

export default function RandomVisualizer(canvas, analyser, dataArray, { waveColor, thickness = 2 }) {
    // Überprüfungen auf korrekte Eingaben
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('RandomVisualizer: Invalid canvas element');
      return;
    }
    if (typeof analyser.getByteTimeDomainData !== 'function') {
      console.error('RandomVisualizer: Invalid analyser node');
      return;
    }
    if (!(dataArray instanceof Uint8Array)) {
      console.error('RandomVisualizer: dataArray must be an instance of Uint8Array');
      return;
    }
  
    // Initialisiere Canvas-Kontext und hole Audiodaten
    const canvasCtx = canvas.getContext('2d');
    analyser.getByteTimeDomainData(dataArray);
  
    // Setze Stiloptionen
    canvasCtx.lineWidth = thickness;
    canvasCtx.strokeStyle = waveColor || 'rgb(0, 255, 0)'; // Standard: Grün
    canvasCtx.beginPath();
  
    // Berechne Breite jedes Segments basierend auf der Datenlänge
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
  
    // Zeichne zufällige Wellenform basierend auf den Audiodaten
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
  
      // Füge eine zufällige Abweichung hinzu, um den "Random"-Effekt zu erzeugen
      const randomOffset = (Math.random() - 0.5) * 50; // Zufälliger Versatz
  
      if (i === 0) {
        canvasCtx.moveTo(x, y + randomOffset);
      } else {
        canvasCtx.lineTo(x, y + randomOffset);
      }
  
      x += sliceWidth;
    }
  
    // Schließe den Pfad und zeichne die Wellenform
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }