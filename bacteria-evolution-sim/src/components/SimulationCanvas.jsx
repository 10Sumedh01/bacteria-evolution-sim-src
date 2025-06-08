import { useRef, useEffect } from 'react';

/**
 * Canvas component for visualizing the bacteria simulation
 */
const SimulationCanvas = ({ 
  width = 800, 
  height = 600, 
  draw, 
  showNutrients = true,
  showToxicity = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  
  // Set up canvas and draw simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw simulation if draw function is provided
    if (draw) {
      draw(ctx, { showNutrients, showToxicity });
    }
  }, [draw, width, height, showNutrients, showToxicity]);
  
  return (
    <div className={`relative border border-border rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
    </div>
  );
};

export default SimulationCanvas;

