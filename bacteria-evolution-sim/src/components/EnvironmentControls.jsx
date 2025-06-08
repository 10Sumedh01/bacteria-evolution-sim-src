import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getEnvironmentPreset } from '@/lib/utils';

/**
 * Component for controlling environmental parameters
 */
const EnvironmentControls = ({ params, updateParams }) => {
  // Presets for quick configuration
  const presets = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Hot', value: 'hot' },
    { label: 'Cold', value: 'cold' },
    { label: 'Acidic', value: 'acidic' },
    { label: 'Alkaline', value: 'alkaline' },
    { label: 'Nutrient Rich', value: 'nutrientRich' },
    { label: 'Nutrient Poor', value: 'nutrientPoor' },
    { label: 'Toxic', value: 'toxic' },
    { label: 'Antibiotic', value: 'antibiotic' },
    { label: 'Extreme', value: 'extreme' }
  ];
  
  // Apply a preset configuration
  const applyPreset = (presetName) => {
    const presetParams = getEnvironmentPreset(presetName);
    updateParams(presetParams);
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Label className="mb-2 block">Preset Environments</Label>
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
            <Label>Temperature</Label>
            <span className="text-sm text-muted-foreground">{params.temperature || 50}</span>
          </div>
          <Slider
            value={[params.temperature || 50]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => updateParams({ temperature: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Cold</span>
            <span className="text-xs text-muted-foreground">Hot</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>pH Level</Label>
            <span className="text-sm text-muted-foreground">{params.pH || 7}</span>
          </div>
          <Slider
            value={[params.pH || 7]}
            min={0}
            max={14}
            step={0.1}
            onValueChange={(value) => updateParams({ pH: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Acidic</span>
            <span className="text-xs text-muted-foreground">Alkaline</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Nutrients</Label>
            <span className="text-sm text-muted-foreground">{params.nutrients || 5}</span>
          </div>
          <Slider
            value={[params.nutrients || 5]}
            min={0}
            max={10}
            step={0.1}
            onValueChange={(value) => updateParams({ nutrients: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Scarce</span>
            <span className="text-xs text-muted-foreground">Abundant</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Toxicity</Label>
            <span className="text-sm text-muted-foreground">{params.toxicity || 0}</span>
          </div>
          <Slider
            value={[params.toxicity || 0]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => updateParams({ toxicity: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">None</span>
            <span className="text-xs text-muted-foreground">Lethal</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Antibiotics</Label>
            <span className="text-sm text-muted-foreground">{params.antibiotics || 0}</span>
          </div>
          <Slider
            value={[params.antibiotics || 0]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => updateParams({ antibiotics: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">None</span>
            <span className="text-xs text-muted-foreground">Strong</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Carrying Capacity</Label>
            <span className="text-sm text-muted-foreground">{params.carryingCapacity || 200}</span>
          </div>
          <Slider
            value={[params.carryingCapacity || 200]}
            min={50}
            max={500}
            step={10}
            onValueChange={(value) => updateParams({ carryingCapacity: value[0] })}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Small</span>
            <span className="text-xs text-muted-foreground">Large</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentControls;

