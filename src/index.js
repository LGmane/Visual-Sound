// src/index.js - Einstiegspunkt der Anwendung, initialisiert React und den globalen AudioContextProvider

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Basis-CSS-Datei
import App from './App';
import { AudioContextProvider } from './components/AppLogic/AudioContextProvider'; // Kontext für globale Audioverwaltung

// 🪴 Initialisiere das React-App-Root-Element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 🌐 AudioContextProvider stellt den globalen Audiokontext zur Verfügung */}
    <AudioContextProvider>
      <App />
    </AudioContextProvider>
  </React.StrictMode>
);