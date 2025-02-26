// src/components/AudioVisualizer/RandomVisualizer.js

/**
 * 🎲 RandomVisualizer: Zeichnet eine zufällige, kreisförmige Wellenform basierend auf Audiodaten.
 * Erlaubt die Anpassung des Ausschlags über einen Multiplikator.
 */

export default function RandomVisualizer(canvas, analyser, dataArray, { waveColor = 'rgb(0, 255, 255)', thickness = 2, amplitudeMultiplier = 200 }) {
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
    canvasCtx.strokeStyle = waveColor || 'rgb(0, 255, 255)'; // Standardfarbe: Türkis
    canvasCtx.beginPath();

    // Definiere Kreisparameter
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 4; // Basisradius bleibt stabil

    // Berechne den Winkel pro Datenpunkt
    const bufferLength = dataArray.length;
    const step = (Math.PI * 2) / bufferLength;

    for (let i = 0; i <= bufferLength; i++) { // Beachte das <=, um den Kreis zu schließen
        const amplitude = dataArray[i % bufferLength] / 255.0;
        const angle = i * step;

        // Berechne den Radius mit verstärktem Ausschlag
        const distRadius = baseRadius + (amplitude - 0.5) * amplitudeMultiplier;

        // Berechne die Positionen entlang des Kreises
        const x = centerX + Math.cos(angle) * distRadius;
        const y = centerY + Math.sin(angle) * distRadius;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
    }

    // Schließe den Kreis
    canvasCtx.closePath();
    canvasCtx.stroke();
}