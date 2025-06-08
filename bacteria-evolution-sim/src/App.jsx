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
  
  // Initialize simulation with default parameters
  const simulation = useSimulation({
    environmentParams: getEnvironmentPreset('neutral'),
    initialBacteriaParams: getBacteriaPreset('balanced'),
    initialPopulation: 50
  });
  
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
      
      // Update environment dimensions
      simulation.updateEnvironment({
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
  }, []);
  
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
            onReset={simulation.reset}
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

