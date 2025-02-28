// src/components/AudioVisualizer/CircleVisualizer.js - Renders a circular waveform of audio data on a canvas

/**
 * 🎡 CircleVisualizer: Visualizes audio data as a dynamic, glowing circular waveform.
 * Uses smooth quadratic curves to create a fluid animation and adapts proportionally to the canvas size.
 * Dynamically scales high amplitude values to avoid clipping at the canvas boundaries.
 */

export default function CircleVisualizer(canvas, analyser, dataArray, { 
    waveColor = 'rgba(255, 255, 0, 0.7)', // 🌟 Default color: Yellow
    amplitudeMultiplier = 5000, 
    amplitudeBoost = 5, 
    scale = 1 
}) {

    // 🛠 Validation Checks
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

    // 🖌 Style settings for the CircleVisualizer with glow effect
    canvasCtx.save(); 
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = waveColor;
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';
    canvasCtx.beginPath();

    // ✨ Apply a strong glow effect ONLY for the CircleVisualizer
    canvasCtx.shadowBlur = 15;
    canvasCtx.shadowColor = 'yellow';

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // 🧮 Calculate base radius and buffer length
    const baseRadius = (Math.min(width, height) / 4) * scale;
    const bufferLength = dataArray.length;
    
    // 🧮 Calculate the step for drawing the circular waveform
    const step = (Math.PI * 2) / (bufferLength * 2);

    // ⏱️ Create a smooth rotation effect for dynamic animation
    const time = performance.now();
    const randomStart = (time * 0.5) % (Math.PI * 2);

    let prevX = centerX + baseRadius;
    let prevY = centerY;

    for (let i = 0; i <= bufferLength * 2; i++) {
        const amplitude = dataArray[i % bufferLength] / 255.0;
        const angle = randomStart + i * step;

        // 🎚️ Calculate the dynamic radius of the circular waveform
        const scaledAmplitude = Math.pow(amplitude, amplitudeBoost) * amplitudeMultiplier * scale;
        const distRadius = baseRadius + (amplitude - 0.5) * scaledAmplitude;

        // 🚦 Dynamically scale the radius to avoid clipping at canvas boundaries
        const maxRadius = Math.min(width, height);
        const scaleFactor = Math.min(1, maxRadius / distRadius);
        const clampedRadius = distRadius * scaleFactor;

        // 🧮 Calculate x and y positions based on the circular angle
        const x = centerX + Math.cos(angle) * clampedRadius;
        const y = centerY + Math.sin(angle) * clampedRadius;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            // 🎨 Draw smooth curves between points using quadratic curves
            const cpX = (prevX + x) / 2;
            const cpY = (prevY + y) / 2;
            canvasCtx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }

        prevX = x;
        prevY = y;
    }

    canvasCtx.closePath();
    canvasCtx.stroke();

    // 🚫 Disable the glow effect for other visualizers
    canvasCtx.restore(); 
}
