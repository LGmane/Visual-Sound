// src/components/AudioVisualizer/VolumeVisualizer.js - Visualisiert die Lautstärke und den Lautstärke-Peak als Balkendiagramm im Canvas

import { calculateVolume, calculatePeak } from '../../utils/audioCalculations';

/**
 * 📈 VolumeVisualizer
 * Zeichnet eine visuelle Darstellung der aktuellen Lautstärke und des Lautstärke-Peaks.
 * 
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element zum Zeichnen
 * @param {AnalyserNode} analyser - Web Audio API AnalyserNode
 * @param {Uint8Array} dataArray - Audiodaten im Zeitbereich
 * @param {Object} options - Visualizer Optionen
 * @param {number} options.decay - Zerfallsrate für den Lautstärke-Peak
 * @param {string} options.volumeColor - Farbe des Lautstärkebalkens
 */
export default function VolumeVisualizer(
  canvas,
  analyser,
  dataArray,
  { decay = 4, volumeColor = 'blue' }
) {
  // 🛠 Validierung der Eingabeparameter
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('VolumeVisualizer: Invalid canvas element');
    return;
  }

  if (typeof analyser.getByteTimeDomainData !== 'function') {
    console.error('VolumeVisualizer: Invalid analyser node');
    return;
  }

  const ctx = canvas.getContext('2d');
  let peak = 0;

  // 🎧 Holen der Audiodaten vom Analyser
  analyser.getByteTimeDomainData(dataArray);

  // 📊 Berechne Lautstärke und Peak
  const volume = calculateVolume(dataArray);
  peak = calculatePeak(volume, peak, decay);

  // 🎨 Zeichne Lautstärke und Peak
  drawVolumeBar(canvas, ctx, volume, peak, volumeColor);
}

/**
 * 🖌 drawVolumeBar
 * Zeichnet den Lautstärkebalken und den Lautstärke-Peak auf das Canvas.
 * 
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element zum Zeichnen
 * @param {CanvasRenderingContext2D} ctx - Der 2D-Zeichenkontext des Canvas
 * @param {number} volume - Die aktuelle Lautstärke (0 bis 1)
 * @param {number} peak - Der berechnete Lautstärke-Peak
 * @param {string} volumeColor - Die Farbe des Lautstärkebalkens
 */
function drawVolumeBar(canvas, ctx, volume, peak, volumeColor) {
  const { width, height } = canvas;

  // 📐 Berechnung der Positionen und Größen des Balkens und des Peaks
  const barX = width - width / 6; // X-Position des Lautstärke-Balkens (rechts im Canvas)
  const barWidth = width / 10; // Breite des Lautstärke-Balkens
  const barHeight = volume * height; // Höhe des Lautstärke-Balkens
  const barY = height - barHeight; // Y-Position des Lautstärke-Balkens

  const peakX = barX; // X-Position des Peak-Balkens
  const peakWidth = barWidth; // Breite des Peak-Balkens
  const peakHeight = peak * height; // Höhe des Peaks
  const peakY = height - peakHeight - 2; // Y-Position des Peak-Balkens

  // 🎨 Zeichne den Lautstärkebalken
  ctx.fillStyle = volumeColor; 
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // 🎯 Zeichne den Lautstärke-Peak
  ctx.fillRect(peakX, peakY - 2, peakWidth, 4); // Festgelegte Höhe des Peaks: 4px
}