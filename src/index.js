// src/index.js - Entry point of the application, initializes React and the global AudioContextProvider

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // 🎨 Base CSS file for global styles
import App from './App';
import { AudioContextProvider } from './components/AppLogic/AudioContextProvider'; // 🎧 Provides global audio management context

// 🪴 Initializes the React app root element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 🌐 AudioContextProvider supplies the global audio context */}
    <AudioContextProvider>
      <App />
    </AudioContextProvider>
  </React.StrictMode>
);
