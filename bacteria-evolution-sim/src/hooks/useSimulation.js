import { useState, useEffect, useRef } from 'react';
import Simulation from '../lib/Simulation';
import useAnimationFrame from './useAnimationFrame';

/**
 * Custom hook for managing the bacteria simulation
 * @param {Object} options - Initial simulation options
 * @returns {Object} - Simulation state and controls
 */
const useSimulation = (options = {}) => {
  // Create simulation instance
  const simulationRef = useRef(null);
  
  // State for simulation parameters
  const [environmentParams, setEnvironmentParams] = useState(options.environmentParams || {});
  const [bacteriaParams, setBacteriaParams] = useState(options.initialBacteriaParams || {});
  const [initialPopulation, setInitialPopulation] = useState(options.initialPopulation || 50);
  
  // State for simulation controls
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // State for simulation data
  const [simulationState, setSimulationState] = useState(null);
  
  // Initialize simulation
  useEffect(() => {
    simulationRef.current = new Simulation({
      environmentParams,
      initialBacteriaParams: bacteriaParams,
      initialPopulation
    });
    
    // Update state with initial simulation state
    setSimulationState(simulationRef.current.getState());
    
    // Clean up
    return () => {
      simulationRef.current = null;
    };
  }, []);
  
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
  
  // Function to reset the simulation
  const reset = () => {
    if (simulationRef.current) {
      simulationRef.current.reset();
      setSimulationState(simulationRef.current.getState());
    }
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
    setInitialPopulation(population);
    
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
    initialPopulation,
    
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

