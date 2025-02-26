let globalAudioContext = null;
let globalAnalyser = null;
let globalStream = null;

export async function setupAudio(deviceId) {
    if (globalAudioContext && globalStream) {
        console.log("Reusing existing AudioContext and Stream");
        return { analyser: globalAnalyser, dataArray: new Uint8Array(globalAnalyser.frequencyBinCount) };
    }

    const constraints = { 
        audio: { 
            deviceId: { exact: deviceId },
            noiseSuppression: false, 
            echoCancellation: false, 
            autoGainControl: false 
        } 
    };

    try {
        globalStream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const analyser = globalAudioContext.createAnalyser();
        const source = globalAudioContext.createMediaStreamSource(globalStream);

        // **1. Lautstärke reduzieren**
        const gainNode = globalAudioContext.createGain();
        gainNode.gain.value = 0.6; // Reduziert die Amplitude um 40%

        // **2. Hochpassfilter gegen Rauschen**
        const highpassFilter = globalAudioContext.createBiquadFilter();
        highpassFilter.type = "highpass";
        highpassFilter.frequency.value = 40; // Filtert Frequenzen unter 80 Hz (Brummen/Rauschen)

        // **3. Verbindungen setzen**
        source.connect(highpassFilter);
        highpassFilter.connect(gainNode);
        gainNode.connect(analyser);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        globalAnalyser = analyser;

        return { analyser, dataArray };
    } catch (error) {
        console.error("Error setting up audio:", error);
        throw error;
    }
}