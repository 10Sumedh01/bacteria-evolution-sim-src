import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for animation frame loop
 * @param {Function} callback - Function to call on each animation frame
 * @param {boolean} active - Whether the animation is active
 * @param {number} fps - Target frames per second (0 for unlimited)
 */
const useAnimationFrame = (callback, active = true, fps = 0) => {
  // Reference to the callback function
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Calculate frame interval based on fps
  const interval = fps > 0 ? 1000 / fps : 0;
  
  // Animation loop
  const animate = useCallback(time => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    
    // If fps is set, only update at the specified interval
    if (interval === 0 || deltaTime >= interval) {
      callbackRef.current(deltaTime);
      previousTimeRef.current = time - (deltaTime % interval);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [interval]);
  
  // Set up and clean up animation frame
  useEffect(() => {
    if (active) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active, animate]);
};

export default useAnimationFrame;

