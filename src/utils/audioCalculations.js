// src/utils/audioCalculations.js - Advanced calculations for the Ball Visualizer

/**
 * 🔢 normalize
 * Normalizes a value to a range between 0 and 1.
 * 
 * @param {number} value - The value to normalize
 * @param {number} max - The maximum possible value (default: 255)
 * @returns {number} Normalized value between 0 and 1
 */
export function normalize(value, max = 255) {
  return value / max;
}

/**
 * 🎧 calculateVolume
 * Calculates the volume (Root Mean Square - RMS) based on audio data.
 * 
 * @param {Uint8Array} dataArray - Audio data in the time domain
 * @returns {number} Normalized volume between 0 and 1
 */
export function calculateVolume(dataArray) {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.pow(dataArray[i] - 128, 2);
  }
  return Math.sqrt(sum / dataArray.length) / 128;
}

/**
 * 📈 calculatePeak
 * Calculates the peak value with an optional decay rate.
 * 
 * @param {number} currentValue - The current value from audio data
 * @param {number} peakValue - The previous peak value
 * @param {number} decay - The decay rate (default: 4)
 * @returns {number} Updated peak value
 */
export function calculatePeak(currentValue, peakValue, decay = 4) {
  if (currentValue > peakValue) {
    return currentValue;
  }
  return Math.max(peakValue - decay, 0);
}

/**
 * 🎶 calculateAverageAmplitude
 * Computes the average amplitude from the data array.
 * 
 * @param {Uint8Array} dataArray - Audio data array
 * @returns {number} Average amplitude value
 */
export function calculateAverageAmplitude(dataArray) {
  const sum = dataArray.reduce((acc, val) => acc + val, 0);
  return sum / dataArray.length;
}

/**
 * 📊 calculateFrequencyInfluence
 * Splits frequency data into low, mid, and high ranges and calculates their influence.
 * 
 * @param {Uint8Array} dataArray - Frequency data array
 * @returns {Object} Normalized influence of low, mid, and high frequencies
 */
export function calculateFrequencyInfluence(dataArray) {
  const low = dataArray.slice(0, dataArray.length / 3);
  const mid = dataArray.slice(dataArray.length / 3, (2 * dataArray.length) / 3);
  const high = dataArray.slice((2 * dataArray.length) / 3);

  const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

  return {
    low: average(low) / 255,
    mid: average(mid) / 255,
    high: average(high) / 255,
  };
}

/**
 * 🌀 applyInertia
 * Ensures that the point moves smoothly instead of jumping abruptly.
 * 
 * @param {number} current - Current position
 * @param {number} target - Target position
 * @param {number} inertia - Inertia factor (default: 0.1)
 * @returns {number} New position with inertia applied
 */
export function applyInertia(current, target, inertia = 0.1) {
  return current + (target - current) * inertia;
}

/**
 * 🎲 generateChaosOffset
 * Computes a random offset based on the music intensity.
 * 
 * @param {number} intensity - The intensity of the music (0 to 1)
 * @param {number} maxOffset - The maximum possible offset (default: 50)
 * @returns {number} Randomized offset value
 */
export function generateChaosOffset(intensity, maxOffset = 50) {
  return (Math.random() - 0.5) * intensity * maxOffset;
}

/**
 * 🎯 calculateBallPosition
 * Calculates the final position of the oscilloscope point.
 * 
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} amplitude - Audio amplitude influencing the position
 * @param {number} chaosFactor - The intensity of random movement
 * @returns {Object} The calculated x and y position of the ball
 */
export function calculateBallPosition(centerX, centerY, amplitude, chaosFactor) {
  return {
    x: centerX + generateChaosOffset(amplitude, chaosFactor),
    y: centerY + generateChaosOffset(amplitude, chaosFactor),
  };
}
