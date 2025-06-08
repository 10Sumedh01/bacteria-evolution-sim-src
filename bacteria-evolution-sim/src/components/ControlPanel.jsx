import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EnvironmentControls from './EnvironmentControls';
import BacteriaControls from './BacteriaControls';
import SimulationControls from './SimulationControls';

/**
 * Control panel component for adjusting simulation parameters
 */
const ControlPanel = ({
  environmentParams,
  updateEnvironment,
  bacteriaParams,
  updateBacteriaParams,
  initialPopulation,
  updateInitialPopulation,
  running,
  speed,
  setSpeed,
  onStart,
  onPause,
  onReset,
  statistics,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('environment');
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle>Simulation Controls</CardTitle>
        <CardDescription>
          Adjust parameters to see how bacteria evolve under different conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimulationControls
          running={running}
          speed={speed}
          setSpeed={setSpeed}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          className="mb-4"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="bacteria">Bacteria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="environment" className="mt-0">
            <EnvironmentControls
              params={environmentParams}
              updateParams={updateEnvironment}
            />
          </TabsContent>
          
          <TabsContent value="bacteria" className="mt-0">
            <BacteriaControls
              params={bacteriaParams}
              updateParams={updateBacteriaParams}
              initialPopulation={initialPopulation}
              updateInitialPopulation={updateInitialPopulation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

