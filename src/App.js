import React, { useRef } from 'react';
import AudioVisualizer from './components/AudioVisualizer';

function App() {
  const analyserRef = useRef(null); // Referenz für den Analyser

  return (
    <div>
      <h1>Visual Sound</h1>
      {/* Technische Ansicht */}
      <AudioVisualizer analyserRef={analyserRef} />
    </div>
  );
}

export default App;
