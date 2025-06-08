import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

/**
 * Component for displaying simulation statistics
 */
const StatisticsPanel = ({ statistics, className = '' }) => {
  const [activeTab, setActiveTab] = useState('population');
  
  if (!statistics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>No data available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Format population history data for chart
  const populationData = statistics.populationHistory.map((value, index) => ({
    generation: index,
    population: value
  }));
  
  // Format trait history data for chart
  const formatTraitData = (traitName) => {
    if (!statistics.averageTraits[traitName]) return [];
    
    return statistics.averageTraits[traitName].map((value, index) => ({
      generation: index,
      [traitName]: value
    }));
  };
  
  // Get current statistics
  const currentGeneration = statistics.generation || 0;
  const currentPopulation = statistics.populationHistory.length > 0
    ? statistics.populationHistory[statistics.populationHistory.length - 1]
    : 0;
  
  // Get current average traits
  const getLatestTraitValue = (traitName) => {
    const traitHistory = statistics.averageTraits[traitName];
    if (!traitHistory || traitHistory.length === 0) return 0;
    return traitHistory[traitHistory.length - 1];
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Statistics</CardTitle>
        <CardDescription>
          Generation: {currentGeneration} | Population: {currentPopulation}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="population">Population</TabsTrigger>
            <TabsTrigger value="traits">Traits</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="population" className="mt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={populationData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="generation" 
                    label={{ value: 'Generation', position: 'insideBottomRight', offset: 0 }} 
                  />
                  <YAxis 
                    label={{ value: 'Population', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="population" 
                    stroke="var(--color-primary)" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="traits" className="mt-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Size</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('size'))}</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Speed</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('speed'))}</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Metabolism</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('metabolism'))}</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Resistance</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('resistance'))}</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Lifespan</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('lifespan'))}</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Mutation Rate</div>
                <div className="text-2xl">{formatNumber(getLatestTraitValue('mutationRate'))}</div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatTraitData('resistance')}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="generation" 
                    label={{ value: 'Generation', position: 'insideBottomRight', offset: 0 }} 
                  />
                  <YAxis 
                    label={{ value: 'Resistance', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="resistance" 
                    stroke="var(--color-chart-1)" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <div className="max-h-64 overflow-y-auto">
              <h3 className="text-sm font-medium mb-2">Extinction Events</h3>
              {statistics.extinctionEvents && statistics.extinctionEvents.length > 0 ? (
                <ul className="space-y-2">
                  {statistics.extinctionEvents.map((event, index) => (
                    <li key={index} className="p-2 border rounded-md text-sm">
                      <div className="font-medium">Generation {event.generation}</div>
                      <div>Population dropped from {event.previousPopulation} to {event.currentPopulation}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No extinction events recorded</p>
              )}
              
              <h3 className="text-sm font-medium mt-4 mb-2">Current Environment</h3>
              {statistics.currentParameters && (
                <ul className="space-y-1 text-sm">
                  <li>Temperature: {formatNumber(statistics.currentParameters.temperature)}</li>
                  <li>pH: {formatNumber(statistics.currentParameters.pH)}</li>
                  <li>Nutrients: {formatNumber(statistics.currentParameters.nutrients)}</li>
                  <li>Toxicity: {formatNumber(statistics.currentParameters.toxicity)}</li>
                  <li>Antibiotics: {formatNumber(statistics.currentParameters.antibiotics)}</li>
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;

