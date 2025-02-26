// src/components/AudioVisualizer/configs.js - Konfigurationsdatei zur Verwaltung der verfügbaren Visualizer-Komponenten

import FrequencyVisualizer from './FrequencyVisualizer'; // 🎨 Visualisiert das Frequenzspektrum als Balkendiagramm
import WaveformVisualizer from './WaveformVisualizer'; // 🌊 Zeichnet die Audiosignale als Wellenform
import VolumeVisualizer from './VolumeVisualizer'; // 📈 Stellt die Lautstärke durch eine Volumenanzeige dar
import RandomVisualizer from './RandomVisualizer'; // 🎲 Zufälliger Visualizer

/**
 * 🧮 Visualizer Konfiguration
 * Verknüpft die Visualizer-Typen mit den entsprechenden Komponenten.
 */
export const Visualizers = {
  frequency: FrequencyVisualizer, // Frequenzspektrum-Visualizer
  waveform: WaveformVisualizer, // Wellenform-Visualizer
  volume: VolumeVisualizer, // Lautstärke-Visualizer
  random: RandomVisualizer, // Zufälliger Visualizer
};