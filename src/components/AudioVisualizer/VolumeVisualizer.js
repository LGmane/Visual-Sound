import { calculateVolume, calculatePeak } from '../../utils/audioCalculations';

export default function VolumeVisualizer(canvas, analyser, dataArray, { decay = 4, volumeColor = 'blue' }) {
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

  

  analyser.getByteTimeDomainData(dataArray);

  // Berechne Lautstärke und Peak
  const volume = calculateVolume(dataArray);
  peak = calculatePeak(volume, peak, decay);

  // Zeichne Lautstärke und Peak
  drawVolumeBar(canvas, ctx, volume, peak, volumeColor);
}

function drawVolumeBar(canvas, ctx, volume, peak, volumeColor) {
  const { width, height } = canvas;

  // Variablen für Positionen und Größen
  const barX = width - width / 6; // X-Position des Lautstärke-Balkens (rechts im Canvas)
  const barWidth = width / 10; // Breite des Balkens
  const barHeight = volume * height; // Höhe des Lautstärke-Balkens
  const barY = height - barHeight; // Y-Position des Lautstärke-Balkens

  const peakX = barX; // X-Position des Peak-Balkens (gleiche wie Lautstärke)
  const peakWidth = barWidth; // Breite des Peak-Balkens (gleiche wie Lautstärke)
  const peakHeight = peak * height; // Höhe des Peaks
  const peakY = height - peakHeight - 2; // Y-Position des Peak-Balkens

  // Zeichne Volumen-Balken
  ctx.fillStyle = volumeColor; // Dynamische Farbe des Balkens
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Zeichne Peak-Balken
  ctx.fillStyle = volumeColor; // Dynamische Farbe des Peaks
  ctx.fillRect(peakX, peakY - 2, peakWidth, 4); // Höhe des Peaks auf 4px festgelegt
}