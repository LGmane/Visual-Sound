// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Import der CSS-Datei
import App from './App';
import { AudioContextProvider } from './components/AppLogic/AudioContextProvider'; // Importiere den Provider



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AudioContextProvider> {/* Kontext umschließt die gesamte App */}
      <App />
    </AudioContextProvider>
  </React.StrictMode>
);


