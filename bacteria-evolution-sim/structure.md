# Project Structure

## Core Simulation Files
- `src/lib/Bacterium.js` - Defines the Bacterium class with properties and behaviors
- `src/lib/Environment.js` - Manages environmental conditions and their effects
- `src/lib/Simulation.js` - Controls the simulation loop and evolution mechanics

## UI Components
- `src/components/SimulationCanvas.jsx` - Canvas for visualizing the bacteria
- `src/components/ControlPanel.jsx` - Contains all the adjustable parameters
- `src/components/StatisticsPanel.jsx` - Displays statistics about the simulation
- `src/components/EnvironmentControls.jsx` - Controls for environmental conditions
- `src/components/BacteriaControls.jsx` - Controls for initial bacteria properties
- `src/components/SimulationControls.jsx` - Start/pause/reset controls

## Utility Files
- `src/lib/utils.js` - Utility functions for calculations and helpers
- `src/hooks/useAnimationFrame.js` - Custom hook for animation loop
- `src/hooks/useSimulation.js` - Custom hook for managing simulation state

## Main Application
- `src/App.jsx` - Main application component that integrates all parts
- `src/App.css` - Styles for the application

