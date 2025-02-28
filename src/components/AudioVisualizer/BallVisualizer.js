// src/components/AudioVisualizer/BallVisualizer.js - Renders dynamic balls with an adjustable vibration range

/**
 * 🎱 BallVisualizer: Visualizes audio data as dynamic, glowing balls with smooth inertia-based movement.
 * Adapts the number, size, and movement of balls based on the audio volume and amplitude.
 */

import { calculateVolume, calculateAverageAmplitude, calculateBallPosition, applyInertia } from '../../utils/audioCalculations';

export default function BallVisualizer(
  canvas,
  analyser,
  dataArray,
  { 
    color = 'rgba(255, 255, 255, 1.0)', 
    glowIntensity = 30, 
    chaosFactor = 150, 
    minRadius = 5, 
    maxRadius = 30, 
    maxBalls = 20, 
    maxMovementRange = 150 
  }
) {

  // 🛠 Validation Checks
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('BallVisualizer: Invalid canvas element');
    return;
  }
  if (typeof analyser.getByteTimeDomainData !== 'function') {
    console.error('BallVisualizer: Invalid analyser node');
    return;
  }
  if (!(dataArray instanceof Uint8Array)) {
    console.error('BallVisualizer: dataArray must be an instance of Uint8Array');
    return;
  }

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;

  // 🎵 Get the time-domain data
  analyser.getByteTimeDomainData(dataArray);

  // 🧮 Calculate volume and amplitude
  const volume = calculateVolume(dataArray); // Volume in the range of 0 to 1
  const amplitude = calculateAverageAmplitude(dataArray) / 255; // Amplitude as a value between 0 and 1
  
  // 🔄 Calculate the chaotic shift for the ball positions based on volume
  // Lower volume results in minimal wobbling
  const dynamicChaosFactor = chaosFactor * Math.pow(volume, 2) * 8 * maxMovementRange;

  // 🎲 Determine the number of balls based on volume (minimum 1 ball)
  const ballCount = Math.max(1, Math.round(volume * maxBalls));

  // 🗂 Store ball positions for drawing connections
  const ballPositions = [];

  // 🖌 Style settings for balls with glow effect
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = color;

  // ⚪️ Draw the balls and save their positions
  for (let i = 0; i < ballCount; i++) {
    // 🎯 Calculate random position around the center based on amplitude and chaos factor
    const { x, y } = calculateBallPosition(centerX, centerY, amplitude, dynamicChaosFactor);

    // 📏 Calculate radius with logarithmic scaling for smoother changes
    const volumeFactor = Math.log(1 + volume * 9);
    let radius = maxRadius - volumeFactor * (maxRadius - minRadius);

    // 🛡 Ensure the radius never drops below the minimum
    radius = Math.max(radius, minRadius);

    // 🚦 Apply inertia for smooth ball movement
    const targetX = applyInertia(centerX, x);
    const targetY = applyInertia(centerY, y);

    // 📍 Store the ball's position for line connections
    ballPositions.push({ x: targetX, y: targetY, radius });

    // 🎨 Draw the ball
    ctx.beginPath();
    ctx.arc(targetX, targetY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🔗 Draw connecting lines between the balls
  for (let i = 0; i < ballPositions.length; i++) {
    for (let j = i + 1; j < ballPositions.length; j++) {
      // ➰ Draw a line from ball i to ball j
      ctx.beginPath();
      ctx.moveTo(ballPositions[i].x, ballPositions[i].y);
      ctx.lineTo(ballPositions[j].x, ballPositions[j].y);
      ctx.strokeStyle = color; // Line color
      ctx.lineWidth = 0.5; // Line width
      ctx.stroke();
    }
  }

  // 🚫 Disable glow effect for other visualizers
  ctx.restore();
}
