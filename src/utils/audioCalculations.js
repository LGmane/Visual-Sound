// src/utils/audioCalculations.js - Hilfsfunktionen zur Berechnung und Normalisierung von Audiodaten

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
  
  // 🔄 Berechnet die Summe der quadrierten Abweichungen vom Mittelwert (128)
  for (let i = 0; i < dataArray.length; i++) {
    sum += Math.pow(dataArray[i] - 128, 2);
  }
  
  // 📐 RMS-Berechnung und Normalisierung zwischen 0 und 1
  return Math.sqrt(sum / dataArray.length) / 128;
}

/**
 * 📈 calculatePeak
 * Berechnet den Spitzenwert mit einer optionalen Zerfallsrate.
 * 
 * @param {number} currentValue - Aktueller Lautstärkewert (0 bis 1)
 * @param {number} peakValue - Bisher gehaltener Spitzenwert
 * @param {number} decay - Zerfallsrate des Peaks (Standard: 4)
 * @returns {number} Aktualisierter Peak-Wert, niemals negativ
 */
export function calculatePeak(currentValue, peakValue, decay = 4) {
  // 🆙 Aktualisiert den Peak, wenn der aktuelle Wert höher ist
  if (currentValue > peakValue) {
    return currentValue;
  }
  
  // 📉 Lässt den Peak langsam sinken, verhindert negative Werte
  return Math.max(peakValue - decay, 0);
}