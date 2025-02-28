// src/components/AudioVisualizer/configs.js - Konfigurationsdatei zur Verwaltung der verfügbaren Visualizer-Komponenten

import FrequencyVisualizer from './FrequencyVisualizer'; // 🎨 Visualisiert das Frequenzspektrum als Balkendiagramm
import WaveformVisualizer from './WaveformVisualizer'; // 🌊 Zeichnet die Audiosignale als Wellenform
import CircleVisualizer from './CircleVisualizer'; // 🌀 Kreis Visualizer
import BallVisualizer from './BallVisualizer'; // 🎛️ Oscilloscope Visualizer

/**
 * 🧮 Visualizer Konfiguration
 * Verknüpft die Visualizer-Typen mit den entsprechenden Komponenten.
 */
export const Visualizers = {
  frequency: FrequencyVisualizer, // Frequenzspektrum-Visualizer
  waveform: WaveformVisualizer, // Wellenform-Visualizer
  circle: CircleVisualizer, // Kreis-Visualizer
  ball: BallVisualizer, // Ball-Visualizer
};
