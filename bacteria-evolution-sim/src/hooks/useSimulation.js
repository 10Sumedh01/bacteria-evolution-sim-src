import { useState, useEffect, useRef } from 'react';
import Simulation from '../lib/Simulation';
import useAnimationFrame from './useAnimationFrame';

/**
 * Custom hook for managing the bacteria simulation
 * @param {Object} initialOptions - Initial simulation options
 * @param {number} resetTrigger - A dependency to trigger re-initialization
 * @returns {Object} - Simulation state and controls
 */
const useSimulation = (initialOptions = {}, resetTrigger = 0) => {
  // Store initial options to reset to them later
  const initialEnvironmentParams = initialOptions.environmentParams || {};
  const initialBacteriaParams = initialOptions.initialBacteriaParams || {};
  const initialPopulation = initialOptions.initialPopulation || 50;

  // Create simulation instance
  const simulationRef = useRef(null);
  
  // State for simulation parameters
  const [environmentParams, setEnvironmentParams] = useState(initialEnvironmentParams);
  const [bacteriaParams, setBacteriaParams] = useState(initialBacteriaParams);
  const [currentInitialPopulation, setCurrentInitialPopulation] = useState(initialPopulation);
  
  // State for simulation controls
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // State for simulation data
  const [simulationState, setSimulationState] = useState(null);
  
  // Effect to (re)initialize simulation when resetTrigger changes
  useEffect(() => {
    simulationRef.current = new Simulation({
      environmentParams: initialEnvironmentParams,
      initialBacteriaParams: initialBacteriaParams,
      initialPopulation: initialPopulation
    });
    
    // Update state with initial simulation state
    setSimulationState(simulationRef.current.getState());
    
    // Reset internal states to initial values when simulation is re-initialized
    setEnvironmentParams(initialEnvironmentParams);
    setBacteriaParams(initialBacteriaParams);
    setCurrentInitialPopulation(initialPopulation);
    setRunning(false);
    setSpeed(1);

    // Clean up
    return () => {
      simulationRef.current = null;
    };
  }, [resetTrigger]); // Depend only on resetTrigger
  
  // Update simulation running state
  useEffect(() => {
    if (simulationRef.current) {
      if (running) {
        simulationRef.current.start();
      } else {
        simulationRef.current.pause();
      }
    }
  }, [running]);
  
  // Update simulation speed
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.setSpeed(speed);
    }
  }, [speed]);
  
  // Animation loop for simulation updates
  useAnimationFrame(
    (deltaTime) => {
      if (simulationRef.current && running) {
        // Update simulation multiple times based on speed
        const steps = Math.max(1, Math.round(speed));
        
        for (let i = 0; i < steps; i++) {
          const state = simulationRef.current.update();
          setSimulationState(state);
        }
      }
    },
    true,
    30 // Target 30 FPS
  );
  
  // Function to start the simulation
  const start = () => {
    setRunning(true);
  };
  
  // Function to pause the simulation
  const pause = () => {
    setRunning(false);
  };
  
  // Function to toggle simulation running state
  const toggle = () => {
    setRunning(prev => !prev);
  };
  
  // Function to reset the simulation (this will be handled by App.jsx)
  const reset = () => {
    // This function is now primarily a placeholder. The actual reset logic
    // is triggered by changing the `simulationKey` in `App.jsx`.
    // We still keep it here for consistency in the returned object.
  };
  
  // Function to update environment parameters
  const updateEnvironment = (params) => {
    setEnvironmentParams(prev => {
      const newParams = { ...prev, ...params };
      
      if (simulationRef.current) {
        simulationRef.current.setEnvironmentParameters(newParams);
      }
      
      return newParams;
    });
  };
  
  // Function to update initial bacteria parameters
  const updateBacteriaParams = (params) => {
    setBacteriaParams(prev => {
      const newParams = { ...prev, ...params };
      
      if (simulationRef.current) {
        simulationRef.current.setInitialBacteriaParameters(newParams);
      }
      
      return newParams;
    });
  };
  
  // Function to update initial population
  const updateInitialPopulation = (population) => {
    setCurrentInitialPopulation(population);
    
    if (simulationRef.current) {
      simulationRef.current.setInitialPopulation(population);
    }
  };
  
  // Function to draw the simulation on a canvas
  const draw = (ctx, options = {}) => {
    if (simulationRef.current) {
      simulationRef.current.draw(ctx, options);
    }
  };
  
  return {
    // Simulation state
    state: simulationState,
    
    // Simulation parameters
    environmentParams,
    bacteriaParams,
    initialPopulation: currentInitialPopulation,
    
    // Simulation controls
    running,
    speed,
    setSpeed,
    
    // Control functions
    start,
    pause,
    toggle,
    reset,
    updateEnvironment,
    updateBacteriaParams,
    updateInitialPopulation,
    
    // Drawing function
    draw
  };
};

export default useSimulation;


