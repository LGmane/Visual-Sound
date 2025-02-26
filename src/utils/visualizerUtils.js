// src/utils/visualizerUtils.js - Bietet Funktionen zum Zeichnen von Audio-Visualisierungen im Canvas

/**
 * 🌊 drawWaveform
 * Zeichnet die Wellenform des Audiosignals im Canvas.
 * 
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element zum Zeichnen
 * @param {AnalyserNode} analyser - Der Web Audio API AnalyserNode
 * @param {Uint8Array} dataArray - Audiodaten im Zeitbereich
 */
export function drawWaveform(canvas, analyser, dataArray) {
  const canvasCtx = canvas.getContext('2d');
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.lineWidth = 2; // 🖌️ Setzt die Linienbreite
  canvasCtx.strokeStyle = 'rgb(0, 255, 0)'; // 🌿 Standardfarbe: Grün
  canvasCtx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;

  // 📈 Zeichnet die Wellenform basierend auf den Audiodaten
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y); // Startpunkt der Linie
    } else {
      canvasCtx.lineTo(x, y); // Linie zu den folgenden Punkten
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2); // 🚦 Schließt die Linie mittig ab
  canvasCtx.stroke();
}

/**
 * 📊 drawFrequencySpectrum
 * Zeichnet das Frequenzspektrum des Audiosignals als Balkendiagramm.
 * 
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element zum Zeichnen
 * @param {AnalyserNode} analyser - Der Web Audio API AnalyserNode
 */
export function drawFrequencySpectrum(canvas, analyser) {
  const canvasCtx = canvas.getContext('2d');
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);

  const barWidth = (canvas.width / frequencyData.length) * 2.5;
  let x = 0;

  // 🎨 Zeichnet Balken für jede Frequenz
  for (let i = 0; i < frequencyData.length; i++) {
    const barHeight = frequencyData[i] / 2;

    // 🟥 Dynamische Farbgebung basierend auf der Höhe des Balkens
    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1; // Abstand zwischen den Balken
  }
}

/**
 * 📈 drawVolumeBar
 * Zeichnet eine Volumenanzeige und einen Peak-Indikator.
 * 
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element
 * @param {number} volume - Normalisierte Lautstärke (0 bis 1)
 * @param {number} peak - Peak-Wert (0 bis 1)
 */
export function drawVolumeBar(canvas, volume, peak) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  // 🎨 Hintergrund setzen
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // 🔊 Zeichnet den Volumen-Balken
  const barHeight = height * volume;
  ctx.fillStyle = 'rgb(0, 255, 0)'; // 🌿 Grün für Lautstärke
  ctx.fillRect(width / 4, height - barHeight, width / 2, barHeight);

  // 🚦 Zeichnet den Peak-Indikator
  const peakPosition = height - height * peak;
  ctx.fillStyle = 'rgb(255, 0, 0)'; // 🟥 Rot für den Peak
  ctx.fillRect(width / 4, peakPosition - 2, width / 2, 4);
}