// src/components/AudioVisualizer/CircleVisualizer.js

/**
 * 🎲 CircleVisualizer: Zeichnet eine dynamische, leuchtende Kreiswellenform basierend auf Audiodaten.
 * Nutzt Bezier-Kurven für weiche Übergänge und fügt einen intensiven Glow-Effekt hinzu.
 */

export default function CircleVisualizer(canvas, analyser, dataArray, { 
    waveColor = 'rgba(255, 255, 0, 0.7)', // 🌟 Standardfarbe: Gelb
    amplitudeMultiplier = 5000, 
    amplitudeBoost = 5, 
    scale = 1 
}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error('CircleVisualizer: Invalid canvas element');
        return;
    }
    if (typeof analyser.getByteTimeDomainData !== 'function') {
        console.error('CircleVisualizer: Invalid analyser node');
        return;
    }
    if (!(dataArray instanceof Uint8Array)) {
        console.error('CircleVisualizer: dataArray must be an instance of Uint8Array');
        return;
    }

    const canvasCtx = canvas.getContext('2d');
    analyser.getByteTimeDomainData(dataArray);

    // 🎨 Setze Stiloptionen für den CircleVisualizer
    canvasCtx.lineWidth = 2; // Fixe Linienbreite für Unabhängigkeit
    canvasCtx.strokeStyle = waveColor;
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';
    canvasCtx.beginPath();

    // ✨ Unabhängiger Glow-Effekt
    canvasCtx.shadowBlur = 30; 
    canvasCtx.shadowColor = 'white'; 

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const baseRadius = (Math.min(width, height) / 4) * scale;
    const bufferLength = dataArray.length;
    
    const step = (Math.PI * 2) / (bufferLength * 2);

    const time = performance.now() / 1000;
    const randomStart = (time * 0.5) % (Math.PI * 2);

    let prevX = centerX + baseRadius;
    let prevY = centerY;

    for (let i = 0; i <= bufferLength * 2; i++) {
        const amplitude = dataArray[i % bufferLength] / 255.0;
        const angle = randomStart + i * step;

        const scaledAmplitude = Math.pow(amplitude, amplitudeBoost) * amplitudeMultiplier * scale;
        const distRadius = baseRadius + (amplitude - 0.5) * scaledAmplitude;
        const clampedRadius = Math.max(0, Math.min(distRadius, Math.min(width, height) / 2));

        const x = centerX + Math.cos(angle) * clampedRadius;
        const y = centerY + Math.sin(angle) * clampedRadius;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
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
