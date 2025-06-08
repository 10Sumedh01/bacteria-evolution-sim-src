import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import StatisticsPanel from './components/StatisticsPanel';
import useSimulation from './hooks/useSimulation';
import { getEnvironmentPreset, getBacteriaPreset } from './lib/utils';
import './App.css';

function App() {
  // Canvas dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  // Visualization options
  const [showNutrients, setShowNutrients] = useState(true);
  const [showToxicity, setShowToxicity] = useState(true);
  
  // State to force re-initialization of useSimulation hook on reset
  const [simulationKey, setSimulationKey] = useState(0);

  // Initialize simulation with default parameters, including canvas dimensions
  const simulation = useSimulation({
    environmentParams: {
      ...getEnvironmentPreset('neutral'),
      width: canvasSize.width,
      height: canvasSize.height,
    },
    initialBacteriaParams: getBacteriaPreset('balanced'),
    initialPopulation: 50
  }, simulationKey);

  // Use a ref to store the simulation object to avoid it being in useEffect dependencies
  const simulationRef = useRef(simulation);

  // Update the ref whenever the simulation object changes
  useEffect(() => {
    simulationRef.current = simulation;
  }, [simulation]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust canvas size based on window size
      const maxWidth = Math.min(window.innerWidth * 0.7, 1000);
      const maxHeight = Math.min(window.innerHeight * 0.7, 700);
      
      setCanvasSize({
        width: maxWidth,
        height: maxHeight
      });
      
      // Update environment dimensions using the ref
      // This is now redundant as dimensions are passed during simulation initialization
      // but kept for potential future dynamic resizing without full reset
      simulationRef.current.updateEnvironment({
        width: maxWidth,
        height: maxHeight
      });
    };
    
    // Set initial size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to run only once
  
  // Function to handle full simulation reset
  const handleReset = () => {
    setSimulationKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bacteria Evolution Simulation</h1>
        <p className="text-muted-foreground">
          Watch bacteria evolve under different environmental conditions
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col space-y-4">
            <SimulationCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              draw={simulation.draw}
              showNutrients={showNutrients}
              showToxicity={showToxicity}
              className="w-full"
            />
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-nutrients"
                  checked={showNutrients}
                  onCheckedChange={setShowNutrients}
                />
                <Label htmlFor="show-nutrients">Show Nutrients</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-toxicity"
                  checked={showToxicity}
                  onCheckedChange={setShowToxicity}
                />
                <Label htmlFor="show-toxicity">Show Toxicity</Label>
              </div>
            </div>
          </div>
          
          <StatisticsPanel
            statistics={simulation.state?.statistics}
            className="w-full"
          />
        </div>
        
        <div className="lg:col-span-1">
          <ControlPanel
            environmentParams={simulation.environmentParams}
            updateEnvironment={simulation.updateEnvironment}
            bacteriaParams={simulation.bacteriaParams}
            updateBacteriaParams={simulation.updateBacteriaParams}
            initialPopulation={simulation.initialPopulation}
            updateInitialPopulation={simulation.updateInitialPopulation}
            running={simulation.running}
            speed={simulation.speed}
            setSpeed={simulation.setSpeed}
            onStart={simulation.start}
            onPause={simulation.pause}
            onReset={handleReset}
            statistics={simulation.state?.statistics}
          />
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Interactive Bacteria Evolution Simulation - Adjust parameters to see how bacteria adapt to different environments
        </p>
      </footer>
    </div>
  );
}

export default App;


