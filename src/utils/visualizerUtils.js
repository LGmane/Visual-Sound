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

