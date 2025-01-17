/**
 * Draws the waveform of the audio signal.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The audio data array for the waveform.
 */
export function drawWaveform(canvas, analyser, dataArray) {
  const canvasCtx = canvas.getContext('2d');
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 255, 0)'; // Green for waveform
  canvasCtx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

/**
 * Draws the frequency spectrum of the audio signal.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 */
export function drawFrequencySpectrum(canvas, analyser) {
  const canvasCtx = canvas.getContext('2d');
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);

  const barWidth = (canvas.width / frequencyData.length) * 2.5;
  let x = 0;

  for (let i = 0; i < frequencyData.length; i++) {
    const barHeight = frequencyData[i] / 2;

    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`; // Dynamic red color
    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

/**
 * Draws a yellow wave that reacts to bass frequencies.
 * @param {CanvasRenderingContext2D} canvasCtx - The 2D context of the canvas.
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 */
export function drawWaveOnBeat(canvasCtx, analyser) {

  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  let amplitude = 0.5;
  let phase = 0;

  function renderWave() {
    analyser.getByteFrequencyData(frequencyData);

    // Calculate bass energy and normalize amplitude
    const bassEnergy = frequencyData.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10;
    amplitude = bassEnergy / 255;

    // Clear the wave area
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, 50);
    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, 50);

    // Draw the wave
    canvasCtx.strokeStyle = 'yellow';
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();

    const waveLength = canvasCtx.canvas.width / 10;
    for (let x = 0; x <= canvasCtx.canvas.width; x++) {
      const y = 25 + Math.sin((x / waveLength) * 2 * Math.PI + phase) * amplitude * 25;
      if (x === 0) canvasCtx.moveTo(x, y);
      else canvasCtx.lineTo(x, y);
    }

    canvasCtx.stroke();
    phase += 0.05;
    requestAnimationFrame(renderWave);
  }

  renderWave();
}

/**
 * Draws an expanding circle triggered by bass impacts.
 * @param {CanvasRenderingContext2D} canvasCtx - The 2D context of the canvas.
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 */
export function drawBassImpact(canvasCtx, analyser) {
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  let impactRadius = 0;
  const bassThreshold = 200;
  const expansionSpeed = 25;

  function renderImpact() {
    analyser.getByteFrequencyData(frequencyData);

    // Calculate bass energy and trigger impact
    const bassEnergy = frequencyData.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10;
    if (bassEnergy > bassThreshold && impactRadius === 0) {
      impactRadius = 1;
    }

    if (impactRadius > 0) {
      const centerX = canvasCtx.canvas.width / 2;
      const centerY = canvasCtx.canvas.height / 2;

      canvasCtx.save();
      canvasCtx.globalCompositeOperation = 'source-over';
      canvasCtx.beginPath();
      canvasCtx.arc(centerX, centerY, impactRadius, 0, 2 * Math.PI);
      canvasCtx.strokeStyle = 'lightblue';
      canvasCtx.lineWidth = 4;
      canvasCtx.stroke();
      canvasCtx.restore();

      impactRadius += expansionSpeed;

      if (impactRadius > Math.max(canvasCtx.canvas.width, canvasCtx.canvas.height)) {
        impactRadius = 0;
      }
    }

    requestAnimationFrame(renderImpact);
  }

  renderImpact();
}
