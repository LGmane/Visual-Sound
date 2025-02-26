// src/components/AudioVisualizer/RandomVisualizer.js

export const drawRandomVisualizer = (canvas, analyser, dataArray, options) => {
    const ctx = canvas.getContext("2d");
    const { waveColor, intensity = 100, rotationSpeed = 0.01 } = options;

    analyser.getByteTimeDomainData(dataArray);

    const { width, height } = canvas;
    const radius = Math.min(width, height) / 4;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = waveColor;
    ctx.shadowBlur = 15;

    const bufferLength = dataArray.length;
    const step = (Math.PI * 2) / bufferLength;

    const time = performance.now() * rotationSpeed;

    ctx.beginPath();

    for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 255.0;
        const angle = i * step + time;

        const distRadius = radius + amplitude * intensity;
        const x = centerX + Math.cos(angle) * distRadius;
        const y = centerY + Math.sin(angle) * distRadius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.stroke();
};