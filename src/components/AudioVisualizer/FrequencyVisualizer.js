// src/components/AudioVisualizer/FrequencyVisualizer.js
const FrequencyVisualizer = {
    draw(canvas, analyser, dataArray) {
      const canvasCtx = canvas.getContext('2d');
      analyser.getByteFrequencyData(dataArray);
  
      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;
  
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    },
  };
  
  export default FrequencyVisualizer;
  