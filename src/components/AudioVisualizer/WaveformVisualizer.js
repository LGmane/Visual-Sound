// src/components/AudioVisualizer/WaveformVisualizer.js
const WaveformVisualizer = {
    draw(canvas, analyser, dataArray) {
      const canvasCtx = canvas.getContext('2d');
      analyser.getByteTimeDomainData(dataArray);
  
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
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
    },
  };
  
  export default WaveformVisualizer;
  