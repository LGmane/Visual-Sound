// src/components/AudioVisualizer/OscilloscopeVisualizer.js - Bälle mit Verbindungen

import { calculateVolume, calculateAverageAmplitude, calculateOscilloscopePosition, applyInertia } from '../../utils/audioCalculations';

export default function OscilloscopeVisualizer(
  canvas,
  analyser,
  dataArray,
  { color = 'rgba(255, 255, 255, 1.0)', glowIntensity = 30, chaosFactor = 200, minRadius = 2, maxRadius = 8, maxBalls = 30 }
) {
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (typeof analyser.getByteTimeDomainData !== 'function') return;
  if (!(dataArray instanceof Uint8Array)) return;

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;

  // Hol dir die Zeitbereichsdaten
  analyser.getByteTimeDomainData(dataArray);

  // Berechne die Lautstärke und die Amplitude
  const volume = calculateVolume(dataArray); // Lautstärke im Bereich 0 bis 1
  const amplitude = calculateAverageAmplitude(dataArray) / 255; // Amplitude als Wert zwischen 0 und 1
  
  // Berechne chaotische Verschiebung für die Position basierend auf Lautstärke
  const dynamicChaosFactor = chaosFactor * volume * 100; // Chaos stärker bei hoher Lautstärke

  // Berechne die Anzahl der Bälle basierend auf der Lautstärke, aber stelle sicher, dass mindestens 1 Ball angezeigt wird
  const ballCount = Math.max(1, Math.round(volume * maxBalls)); // Minimum 1 Ball, auch bei niedrigster Lautstärke

  // Positionen der Bälle speichern
  const ballPositions = [];

  // Canvas-Kontext-Einstellungen für den Hintergrund (damit Linien sichtbar bleiben)
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = color;

  // Zeichne die Bälle und speichere ihre Positionen
  for (let i = 0; i < ballCount; i++) {
    // Zufällige Position der Bälle um den Mittelpunkt
    const { x, y } = calculateOscilloscopePosition(centerX, centerY, amplitude, dynamicChaosFactor);

    // Zufällige Größe für jeden Ball basierend auf Lautstärke
    const radius = minRadius + volume * (maxRadius - minRadius); // Dynamischer Radius zwischen min und max

    // Verwende Inertia für eine sanfte Bewegung
    const targetX = applyInertia(centerX, x);
    const targetY = applyInertia(centerY, y);

    // Speicher die Position jedes Balls für die Linienzeichnung
    ballPositions.push({ x: targetX, y: targetY, radius });

    // Zeichne den Ball
    ctx.beginPath();
    ctx.arc(targetX, targetY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Linien zwischen den Bällen zeichnen
  for (let i = 0; i < ballPositions.length; i++) {
    for (let j = i + 1; j < ballPositions.length; j++) {
      // Linie von Ball i zu Ball j
      ctx.beginPath();
      ctx.moveTo(ballPositions[i].x, ballPositions[i].y);
      ctx.lineTo(ballPositions[j].x, ballPositions[j].y);
      ctx.strokeStyle = color; // Linienfarbe
      ctx.lineWidth = 0.5; // Linienbreite
      ctx.stroke();
    }
  }

  ctx.restore();
}
