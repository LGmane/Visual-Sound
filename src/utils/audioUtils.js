export async function setupAudio(deviceId) {
    const constraints = { audio: { deviceId: { exact: deviceId } } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
  
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    return { analyser, dataArray };
  }
  