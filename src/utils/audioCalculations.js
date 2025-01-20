// Normalize a value to a range
export function normalize(value, max = 255) {
  return value / max;
}

// Calculate volume (RMS) efficiently
export function calculateVolume(dataArray) {
  let sumSquares = 0;
  const length = dataArray.length;

  for (let i = 0; i < length; i++) {
    const centeredValue = dataArray[i] - 128;
    sumSquares += centeredValue * centeredValue;
  }

  return Math.sqrt(sumSquares / length) / 128; // Normalization [0, 1]
}

// Calculate bass energy (average of low frequencies)
export function calculateBassEnergy(frequencyData, bins = 10) {
  let sum = 0;
  bins = Math.min(bins, frequencyData.length); // Ensure bins don't exceed array length

  for (let i = 0; i < bins; i++) {
    sum += frequencyData[i];
  }

  return sum / bins;
}

// Calculate peak hold logic (with decay)
export function calculatePeak(currentValue, peakValue, decay = 5) {
  return currentValue > peakValue ? currentValue : Math.max(peakValue - decay, 0);
}

// Generic RMS calculation
export function calculateRMS(dataArray, reference = 128) {
  let sumSquares = 0;
  const length = dataArray.length;

  for (let i = 0; i < length; i++) {
    const centeredValue = dataArray[i] - reference;
    sumSquares += centeredValue * centeredValue;
  }

  return Math.sqrt(sumSquares / length);
}

// Calculate average for a subset of an array efficiently
export function calculateAverage(dataArray, startIndex = 0, endIndex = dataArray.length) {
  let sum = 0;
  endIndex = Math.min(endIndex, dataArray.length); // Ensure endIndex is within bounds

  for (let i = startIndex; i < endIndex; i++) {
    sum += dataArray[i];
  }

  return sum / (endIndex - startIndex);
}
