// src/components/AppLogic/FullscreenContainer.js - Provides fullscreen mode for nested components

import React, { useRef, useState, useEffect } from 'react';
import "../../styles/App.css";

/**
 * 🎬 FullscreenContainer Component
 * Provides unified control for fullscreen mode for any child components.
 * 
 * @param {ReactNode} children - The component to be displayed in fullscreen mode
 */
function FullscreenContainer({ children }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🔄 Toggles between fullscreen and standard view
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

  // 🎯 Keeps the button state synchronized with fullscreen changes
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

      {/* ⛶ Button to toggle fullscreen mode */}
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
