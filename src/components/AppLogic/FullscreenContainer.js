// src/components/AppLogic/FullscreenContainer.js - Bietet Fullscreen-Modus für verschachtelte Komponenten

import React, { useRef, useState, useEffect } from 'react';
import "../../styles/App.css";

/**
 * 🎬 FullscreenContainer Komponente
 * Bietet eine einheitliche Steuerung für den Fullscreen-Modus für beliebige Kinder-Komponenten.
 * 
 * @param {ReactNode} children - Die Komponente, die im Fullscreen-Modus dargestellt werden soll
 */
function FullscreenContainer({ children }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🔄 Wechselt zwischen Fullscreen und Standardansicht
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }
  };

  // 🎯 Stellt sicher, dass der Button-Zustand synchron bleibt
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="fullscreen-container">
      {children}

      <button
        className="fullscreen-button"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>
    </div>
  );
}

export default FullscreenContainer;
