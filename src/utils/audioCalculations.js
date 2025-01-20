// Normalize a value to a range
export function normalize(value, max = 255) {
    return value / max;
  }
  
  // Calculate volume (RMS)
  export function calculateVolume(dataArray) {
    let sumSquares = 0;

    // Berechnung des quadrierten Mittelwerts
    for (let i = 0; i < dataArray.length; i++) {
        const centeredValue = dataArray[i] - 128;
        sumSquares += centeredValue * centeredValue;
    }

    // RMS-Wert berechnen und normalisieren
    return Math.sqrt(sumSquares / dataArray.length) / 128; // Normalisierung [0, 1]
}
  
/*
  // Calculate energy level (overall signal strength)
  export function calculateEnergyLevel(dataArray) {
    const sum = dataArray.reduce((acc, value) => acc + Math.abs(value - 128), 0);
    return sum / dataArray.length / 128; // Normalize to [0, 1]
  }
  */
  
  // Calculate bass energy (average of low frequencies)
  export function calculateBassEnergy(frequencyData, bins = 10) {
    return calculateAverage(frequencyData, 0, bins);
  }
  
  // Calculate peak hold logic (with decay)
  export function calculatePeak(currentValue, peakValue, decay = 5) {
    return currentValue > peakValue ? currentValue : Math.max(peakValue - decay, 0);
  }
  
  // Calculate RMS (generic root mean square function)
  export function calculateRMS(dataArray, reference = 128) {
    const sum = dataArray.reduce((acc, value) => acc + (value - reference) ** 2, 0);
    return Math.sqrt(sum / dataArray.length);
  }
  
  // Calculate average for a subset of an array
  export function calculateAverage(dataArray, startIndex = 0, endIndex = dataArray.length) {
    const slicedArray = dataArray.slice(startIndex, endIndex);
    const sum = slicedArray.reduce((acc, value) => acc + value, 0);
    return sum / slicedArray.length;
  }
  