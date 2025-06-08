/**
 * Bacterium class representing a single bacterium in the simulation
 */
class Bacterium {
  /**
   * Create a new bacterium
   * @param {Object} options - Configuration options
   * @param {number} options.x - X position
   * @param {number} options.y - Y position
   * @param {number} options.size - Size of the bacterium (affects energy consumption and reproduction)
   * @param {number} options.speed - Movement speed (affects ability to find food)
   * @param {number} options.metabolism - Rate of energy consumption
   * @param {number} options.resistance - Resistance to harsh conditions
   * @param {number} options.lifespan - Maximum number of cycles the bacterium can live
   * @param {number} options.mutationRate - Probability of mutation during reproduction
   * @param {string} options.color - Color representation (derived from properties)
   */
  constructor(options = {}) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.size = options.size || 5;
    this.speed = options.speed || 1;
    this.metabolism = options.metabolism || 1;
    this.resistance = options.resistance || 1;
    this.lifespan = options.lifespan || 100;
    this.mutationRate = options.mutationRate || 0.1;
    
    // Internal state
    this.age = 0;
    this.energy = 100;
    this.alive = true;
    this.reproductionCooldown = 0;
    
    // Calculate color based on properties (can be overridden)
    this.color = options.color || this.calculateColor();
    
    // Movement vector
    this.vx = (Math.random() * 2 - 1) * this.speed;
    this.vy = (Math.random() * 2 - 1) * this.speed;
  }
  
  /**
   * Calculate color based on bacterium properties
   * @returns {string} - CSS color string
   */
  calculateColor() {
    // Use HSL color model for easy manipulation
    // Hue based on resistance (0-360)
    const hue = (this.resistance * 120) % 360;
    // Saturation based on metabolism (50-100%)
    const saturation = 50 + (this.metabolism * 50);
    // Lightness based on speed (30-70%)
    const lightness = 30 + (this.speed * 40);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  /**
   * Update the bacterium state for one simulation step
   * @param {Object} environment - Current environment conditions
   * @returns {boolean} - Whether the bacterium is still alive
   */
  update(environment) {
    if (!this.alive) return false;
    
    // Age the bacterium
    this.age++;
    
    // Decrease reproduction cooldown
    if (this.reproductionCooldown > 0) {
      this.reproductionCooldown--;
    }
    
    // Calculate energy consumption based on size, metabolism and environmental factors
    const baseConsumption = this.size * this.metabolism;
    const tempFactor = this.calculateTemperatureFactor(environment.temperature);
    const pHFactor = this.calculatePHFactor(environment.pH);
    const toxicityFactor = this.calculateToxicityFactor(environment.toxicity);
    
    // Total energy consumption
    const energyConsumption = baseConsumption * tempFactor * pHFactor * toxicityFactor;
    
    // Consume energy
    this.energy -= energyConsumption;
    
    // Gain energy from nutrients
    this.energy += this.absorbNutrients(environment.nutrients);
    
    // Check if bacterium dies
    if (this.energy <= 0 || this.age >= this.lifespan) {
      this.alive = false;
      return false;
    }
    
    // Move the bacterium
    this.move(environment);
    
    return true;
  }
  
  /**
   * Calculate temperature effect on energy consumption
   * @param {number} temperature - Current temperature
   * @returns {number} - Multiplier for energy consumption
   */
  calculateTemperatureFactor(temperature) {
    // Optimal temperature is 50, deviation increases energy consumption
    const optimalTemp = 50;
    const deviation = Math.abs(temperature - optimalTemp) / 50;
    
    // Resistance reduces the impact of temperature
    const resistanceFactor = 1 - (this.resistance * 0.5);
    
    return 1 + (deviation * resistanceFactor);
  }
  
  /**
   * Calculate pH effect on energy consumption
   * @param {number} pH - Current pH level
   * @returns {number} - Multiplier for energy consumption
   */
  calculatePHFactor(pH) {
    // Optimal pH is 7, deviation increases energy consumption
    const optimalPH = 7;
    const deviation = Math.abs(pH - optimalPH) / 7;
    
    // Resistance reduces the impact of pH
    const resistanceFactor = 1 - (this.resistance * 0.5);
    
    return 1 + (deviation * resistanceFactor);
  }
  
  /**
   * Calculate toxicity effect on energy consumption
   * @param {number} toxicity - Current toxicity level
   * @returns {number} - Multiplier for energy consumption
   */
  calculateToxicityFactor(toxicity) {
    // Resistance reduces the impact of toxicity
    const resistanceFactor = 1 - (this.resistance * 0.8);
    
    return 1 + (toxicity * resistanceFactor);
  }
  
  /**
   * Absorb nutrients from the environment
   * @param {number} nutrients - Available nutrients
   * @returns {number} - Energy gained from nutrients
   */
  absorbNutrients(nutrients) {
    // Larger bacteria can absorb more nutrients
    const absorptionRate = this.size * 0.5;
    
    // Metabolism affects nutrient processing efficiency
    const processingEfficiency = 0.5 + (this.metabolism * 0.5);
    
    return nutrients * absorptionRate * processingEfficiency;
  }
  
  /**
   * Move the bacterium based on its speed and environment
   * @param {Object} environment - Current environment conditions
   */
  move(environment) {
    // Occasionally change direction
    if (Math.random() < 0.1) {
      this.vx = (Math.random() * 2 - 1) * this.speed;
      this.vy = (Math.random() * 2 - 1) * this.speed;
    }
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Boundary checking
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    } else if (this.x > environment.width) {
      this.x = environment.width;
      this.vx *= -1;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    } else if (this.y > environment.height) {
      this.y = environment.height;
      this.vy *= -1;
    }
  }
  
  /**
   * Attempt to reproduce
   * @param {Object} environment - Current environment conditions
   * @returns {Bacterium|null} - New bacterium or null if reproduction failed
   */
  reproduce(environment) {
    // Check if reproduction is possible
    if (!this.alive || this.reproductionCooldown > 0 || this.energy < 50) {
      return null;
    }
    
    // Reproduction costs energy
    this.energy *= 0.7;
    
    // Set reproduction cooldown
    this.reproductionCooldown = 20;
    
    // Create offspring with potential mutations
    const childProperties = {
      x: this.x + (Math.random() * 10 - 5),
      y: this.y + (Math.random() * 10 - 5),
      size: this.mutateProperty(this.size),
      speed: this.mutateProperty(this.speed),
      metabolism: this.mutateProperty(this.metabolism),
      resistance: this.mutateProperty(this.resistance),
      lifespan: this.mutateProperty(this.lifespan),
      mutationRate: this.mutateProperty(this.mutationRate)
    };
    
    return new Bacterium(childProperties);
  }
  
  /**
   * Mutate a property based on mutation rate
   * @param {number} value - Original property value
   * @returns {number} - Mutated property value
   */
  mutateProperty(value) {
    if (Math.random() < this.mutationRate) {
      // Apply mutation
      const mutationStrength = 0.2; // 20% change max
      const change = 1 + ((Math.random() * 2 - 1) * mutationStrength);
      return value * change;
    }
    return value;
  }
  
  /**
   * Draw the bacterium on a canvas context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (!this.alive) return;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw direction indicator
    const dirX = this.x + this.vx * this.size;
    const dirY = this.y + this.vy * this.size;
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(dirX, dirY);
    ctx.stroke();
  }
}

export default Bacterium;

