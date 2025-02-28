// src/utils/audioSetup.js - Sets up the AudioContext and audio processing pipeline

let globalAudioContext = null;
let globalAnalyser = null;
let globalStream = null;

/**
 * 🎧 setupAudio
 * Initializes the audio context, analyser, and stream for a selected audio input device.
 * 
 * @param {string} deviceId - The ID of the selected audio input device
 * @returns {Object} Contains the analyser node and data array for audio visualization
 */
export async function setupAudio(deviceId) {
    // 🚦 Reuse existing AudioContext and Stream if available
    if (globalAudioContext && globalStream) {
        console.log("Reusing existing AudioContext and Stream");
        return { 
            analyser: globalAnalyser, 
            dataArray: new Uint8Array(globalAnalyser.frequencyBinCount) 
        };
    }

    // 🎛️ Define audio constraints for the selected device
    const constraints = { 
        audio: { 
            deviceId: { exact: deviceId },
            noiseSuppression: false, 
            echoCancellation: false, 
            autoGainControl: false 
        } 
    };

    try {
        // 🎙️ Request access to the audio input device
        globalStream = await navigator.mediaDevices.getUserMedia(constraints);

        // 🎧 Initialize the AudioContext if not already set
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // 🎚️ Create an AnalyserNode and MediaStreamSource
        const analyser = globalAudioContext.createAnalyser();
        const source = globalAudioContext.createMediaStreamSource(globalStream);

        // 🎛️ 1. Reduce Volume using GainNode
        const gainNode = globalAudioContext.createGain();
        gainNode.gain.value = 0.6; // Reduces amplitude by 40%

        // 🎚️ 2. Highpass Filter to reduce low-frequency noise
        const highpassFilter = globalAudioContext.createBiquadFilter();
        highpassFilter.type = "highpass";
        highpassFilter.frequency.value = 20; // Filters frequencies below 20 Hz

        // 🎚️ 3. Lowpass Filter to reduce high-frequency noise
        const lowpassFilter = globalAudioContext.createBiquadFilter();
        lowpassFilter.type = "lowpass";
        lowpassFilter.frequency.value = 20000; // Filters frequencies above 20,000 Hz

        // 🔗 4. Connect Audio Nodes in the processing chain
        source.connect(highpassFilter);
        highpassFilter.connect(lowpassFilter);
        lowpassFilter.connect(gainNode);
        gainNode.connect(analyser);

        // 🧮 Configure AnalyserNode settings
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // 💾 Store global references for reuse
        globalAnalyser = analyser;

        return { analyser, dataArray };
    } catch (error) {
        console.error("Error setting up audio:", error);
        throw error;
    }
}
