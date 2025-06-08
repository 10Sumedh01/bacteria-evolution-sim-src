import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react';

/**
 * Component for controlling simulation execution
 */
const SimulationControls = ({
  running,
  speed,
  setSpeed,
  onStart,
  onPause,
  onReset,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        {!running ? (
          <Button onClick={onStart} className="flex-1">
            <PlayIcon className="mr-2 h-4 w-4" />
            Start
          </Button>
        ) : (
          <Button onClick={onPause} className="flex-1" variant="secondary">
            <PauseIcon className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        
        <Button onClick={onReset} variant="outline" className="flex-1">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Simulation Speed</Label>
          <span className="text-sm text-muted-foreground">
            {speed}x
          </span>
        </div>
        <Slider
          value={[speed]}
          min={0.5}
          max={5}
          step={0.5}
          onValueChange={(value) => setSpeed(value[0])}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Slow</span>
          <span className="text-xs text-muted-foreground">Fast</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;

