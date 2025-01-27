// Normalize a value to a range
export function normalize(value, max = 255) {
  return value / max;
}

// Calculate volume (RMS) efficiently
export function calculateVolume(dataArray) {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.pow(dataArray[i] - 128, 2);
  }
  return Math.sqrt(sum / dataArray.length) / 128; // Normalisiert zwischen 0 und 1
}

// Calculate peak hold logic (with decay)
export function calculatePeak(currentValue, peakValue, decay = 4) {
  // Wenn die aktuelle Lautstärke höher ist als der Peak, aktualisiere den Peak
  if (currentValue > peakValue) {
    return currentValue;
  }
  // Lasse den Peak langsam sinken
  return Math.max(peakValue - decay, 0); // Verhindere negative Werte
}
