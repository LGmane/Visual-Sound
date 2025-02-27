// src/utils/audioCalculations.js - Erweiterte Berechnungen für den Oscilloscope Visualizer

/**
 * 🔢 normalize
 * Normalisiert einen Wert auf einen Bereich von 0 bis 1.
 * 
 * @param {number} value - Der zu normalisierende Wert
 * @param {number} max - Der maximale Wert (Standard: 255)
 * @returns {number} Normalisierter Wert zwischen 0 und 1
 */
export function normalize(value, max = 255) {
  return value / max;
}

/**
 * 🎧 calculateVolume
 * Berechnet die Lautstärke (Root Mean Square - RMS) basierend auf Audiodaten.
 * 
 * @param {Uint8Array} dataArray - Audiodaten im Zeitbereich
 * @returns {number} Normalisierte Lautstärke zwischen 0 und 1
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
 * Berechnet den Spitzenwert mit einer optionalen Zerfallsrate.
 */
export function calculatePeak(currentValue, peakValue, decay = 4) {
  if (currentValue > peakValue) {
    return currentValue;
  }
  return Math.max(peakValue - decay, 0);
}

/**
 * 🎶 calculateAverageAmplitude
 * Berechnet die Durchschnittsamplitude aus dem Datenarray.
 */
export function calculateAverageAmplitude(dataArray) {
  const sum = dataArray.reduce((acc, val) => acc + val, 0);
  return sum / dataArray.length;
}

/**
 * 📊 calculateFrequencyInfluence
 * Teilt die Frequenzdaten in niedrige, mittlere und hohe Bereiche auf.
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
 * Sorgt dafür, dass der Punkt nicht abrupt springt, sondern fließend gleitet.
 */
export function applyInertia(current, target, inertia = 0.1) {
  return current + (target - current) * inertia;
}

/**
 * 🎲 generateChaosOffset
 * Berechnet einen zufälligen Offset basierend auf der Musikintensität.
 */
export function generateChaosOffset(intensity, maxOffset = 50) {
  return (Math.random() - 0.5) * intensity * maxOffset;
}

/**
 * 🎯 calculateOscilloscopePosition
 * Berechnet die endgültige Position des Oszilloskop-Punkts.
 */
export function calculateOscilloscopePosition(centerX, centerY, amplitude, chaosFactor) {
  return {
    x: centerX + generateChaosOffset(amplitude, chaosFactor),
    y: centerY + generateChaosOffset(amplitude, chaosFactor),
  };
}
