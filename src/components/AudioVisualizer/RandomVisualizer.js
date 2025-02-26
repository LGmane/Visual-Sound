// src/components/AudioVisualizer/RandomVisualizer.js

import { calculateVolume } from '../../utils/audioCalculations';

/**
 * 🎲 RandomVisualizer: Zeichnet eine dynamische, weiche Kreiswellenform basierend auf Audiodaten.
 * Nutzt Bezier-Kurven für weiche Übergänge und mehr Punkte für ein runderes Erscheinungsbild.
 */

export default function RandomVisualizer(canvas, analyser, dataArray, { waveColor = 'rgb(0, 255, 255)', thickness = 2, amplitudeMultiplier = 10000, amplitudeBoost = 5 }) {
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

    const canvasCtx = canvas.getContext('2d');
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = thickness;
    canvasCtx.strokeStyle = waveColor || 'rgb(0, 255, 255)';
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';
    canvasCtx.beginPath();

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const baseRadius = Math.min(width, height) / 4;
    const bufferLength = dataArray.length;
    
    // 🌀 Erhöhe die Anzahl der Punkte für weichere Übergänge
    const step = (Math.PI * 2) / (bufferLength * 2);

    const time = performance.now() / 1000;
    const randomStart = (time * 0.5) % (Math.PI * 2);

    // 💡 Speichere vorherige Koordinaten für Bezier-Kurven
    let prevX = centerX + baseRadius;
    let prevY = centerY;

    for (let i = 0; i <= bufferLength * 2; i++) {
        const amplitude = dataArray[i % bufferLength] / 255.0;
        const angle = randomStart + i * step;

        const scaledAmplitude = Math.pow(amplitude, amplitudeBoost) * amplitudeMultiplier;

        const distRadius = baseRadius + (amplitude - 0.5) * scaledAmplitude;
        const clampedRadius = Math.max(0, Math.min(distRadius, Math.min(width, height) / 2));

        const x = centerX + Math.cos(angle) * clampedRadius;
        const y = centerY + Math.sin(angle) * clampedRadius;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            // 🎨 Nutze Bezier-Kurven für weiche Übergänge
            const cpX = (prevX + x) / 2;
            const cpY = (prevY + y) / 2;
            canvasCtx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }

        prevX = x;
        prevY = y;
    }

    canvasCtx.closePath();
    canvasCtx.stroke();
}