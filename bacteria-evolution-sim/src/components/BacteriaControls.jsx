import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBacteriaPreset } from '@/lib/utils';

/**
 * Component for controlling bacteria parameters
 */
const BacteriaControls = ({ 
  params, 
  updateParams, 
  initialPopulation, 
  updateInitialPopulation 
}) => {
  // Presets for quick configuration
  const presets = [
    { label: 'Balanced', value: 'balanced' },
    { label: 'Large', value: 'large' },
    { label: 'Small', value: 'small' },
    { label: 'Fast', value: 'fast' },
    { label: 'Efficient', value: 'efficient' },
    { label: 'Resistant', value: 'resistant' },
    { label: 'Mutable', value: 'mutable' },
    { label: 'Stable', value: 'stable' }
  ];
  
  // Apply a preset configuration
  const applyPreset = (presetName) => {
    const presetParams = getBacteriaPreset(presetName);
    updateParams(presetParams);
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Label className="mb-2 block">Preset Bacteria Types</Label>
        <Select onValueChange={applyPreset}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Initial Population</Label>
            <span className="text-sm text-muted-foreground">{initialPopulation}</span>
          </div>
          <Slider
            value={[initialPopulation]}
            min={10}
            max={200}
            step={5}
            onValueChange={(value) => updateInitialPopulation(value[0])}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Size</Label>
            <span className="text-sm text-muted-foreground">{params.size || 5}</span>
          </div>
          <Slider
            value={[params.size || 5]}
            min={2}
            max={10}
            step={0.1}
            onValueChange={(value) => updateParams({ size: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Small</span>
            <span className="text-xs text-muted-foreground">Large</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Speed</Label>
            <span className="text-sm text-muted-foreground">{params.speed || 1}</span>
          </div>
          <Slider
            value={[params.speed || 1]}
            min={0.2}
            max={3}
            step={0.1}
            onValueChange={(value) => updateParams({ speed: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Slow</span>
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Metabolism</Label>
            <span className="text-sm text-muted-foreground">{params.metabolism || 1}</span>
          </div>
          <Slider
            value={[params.metabolism || 1]}
            min={0.2}
            max={2}
            step={0.1}
            onValueChange={(value) => updateParams({ metabolism: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Efficient</span>
            <span className="text-xs text-muted-foreground">Rapid</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Resistance</Label>
            <span className="text-sm text-muted-foreground">{params.resistance || 1}</span>
          </div>
          <Slider
            value={[params.resistance || 1]}
            min={0.2}
            max={3}
            step={0.1}
            onValueChange={(value) => updateParams({ resistance: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Vulnerable</span>
            <span className="text-xs text-muted-foreground">Resistant</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Lifespan</Label>
            <span className="text-sm text-muted-foreground">{params.lifespan || 100}</span>
          </div>
          <Slider
            value={[params.lifespan || 100]}
            min={50}
            max={200}
            step={5}
            onValueChange={(value) => updateParams({ lifespan: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Short</span>
            <span className="text-xs text-muted-foreground">Long</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Mutation Rate</Label>
            <span className="text-sm text-muted-foreground">{params.mutationRate || 0.1}</span>
          </div>
          <Slider
            value={[params.mutationRate || 0.1]}
            min={0.01}
            max={0.5}
            step={0.01}
            onValueChange={(value) => updateParams({ mutationRate: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Stable</span>
            <span className="text-xs text-muted-foreground">Mutable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacteriaControls;

