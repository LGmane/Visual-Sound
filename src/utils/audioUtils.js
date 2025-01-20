
export async function setupAudio(deviceId) {
  // Define constraints for the audio input
  const constraints = { audio: { deviceId: { exact: deviceId } } };

  try {
    // Access the user's audio stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Create the audio context and analyser
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    // Connect the stream to the analyser
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    // Configure the analyser
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Return the analyser and data array
    return { analyser, dataArray };
  } catch (error) {
    console.error("Error setting up audio:", error);
    throw error;
  }
}
