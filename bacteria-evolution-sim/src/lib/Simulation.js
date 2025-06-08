import Bacterium from './Bacterium';
import Environment from './Environment';

/**
 * Simulation class to control the bacteria evolution simulation
 */
class Simulation {
  /**
   * Create a new simulation
   * @param {Object} options - Configuration options
   * @param {Object} options.environmentParams - Parameters for the environment
   * @param {Object} options.initialBacteriaParams - Parameters for initial bacteria
   * @param {number} options.initialPopulation - Initial number of bacteria
   */
  constructor(options = {}) {
    const { 
      environmentParams = {}, 
      initialBacteriaParams = {},
      initialPopulation = 50
    } = options;
    
    console.log("Simulation constructor called with environmentParams:", environmentParams);
    this.environment = new Environment(environmentParams);
    this.bacteria = [];
    this.initialBacteriaParams = initialBacteriaParams;
    this.initialPopulation = initialPopulation;
    
    this.running = false;
    this.speed = 1; // Simulation speed multiplier
    
    // Initialize bacteria population
    this.initializePopulation();
    console.log("Simulation initialized. Initial population:", this.bacteria.length);
  }
  
  /**
   * Initialize the bacteria population
   */
  initializePopulation() {
    this.bacteria = [];
    
    for (let i = 0; i < this.initialPopulation; i++) {
      const bacterium = new Bacterium({
        x: Math.random() * this.environment.width,
        y: Math.random() * this.environment.height,
        size: this.initialBacteriaParams.size || 5 + (Math.random() * 3 - 1.5),
        speed: this.initialBacteriaParams.speed || 1 + (Math.random() * 0.6 - 0.3),
        metabolism: this.initialBacteriaParams.metabolism || 1 + (Math.random() * 0.4 - 0.2),
        resistance: this.initialBacteriaParams.resistance || 1 + (Math.random() * 0.4 - 0.2),
        lifespan: this.initialBacteriaParams.lifespan || 100 + (Math.random() * 40 - 20),
        mutationRate: this.initialBacteriaParams.mutationRate || 0.1 + (Math.random() * 0.04 - 0.02)
      });
      
      this.bacteria.push(bacterium);
    }
    console.log("Population initialized with", this.bacteria.length, "bacteria.");
  }
  
  /**
   * Start the simulation
   */
  start() {
    this.running = true;
    console.log("Simulation started.");
  }
  
  /**
   * Pause the simulation
   */
  pause() {
    this.running = false;
    console.log("Simulation paused.");
  }
  
  /**
   * Reset the simulation
   */
  reset() {
    console.log("Resetting simulation...");
    // Preserve current width and height when resetting environment
    const currentEnvParams = this.environment.getStatistics().currentParameters;
    console.log("Current environment parameters before reset:", currentEnvParams);
    this.environment = new Environment({
      ...currentEnvParams,
      width: currentEnvParams.width,
      height: currentEnvParams.height
    });
    
    this.initializePopulation();
    console.log("Simulation reset complete.");
  }
  
  /**
   * Set simulation speed
   * @param {number} speed - Speed multiplier
   */
  setSpeed(speed) {
    this.speed = speed;
    console.log("Simulation speed set to:", speed);
  }
  
  /**
   * Update the simulation for one step
   * @returns {Object} - Current simulation state
   */
  update() {
    if (!this.running) {
      return this.getState();
    }
    
    // Update environment
    this.environment.update(this.bacteria);
    
    // Update each bacterium
    const newBacteria = [];
    
    for (const bacterium of this.bacteria) {
      // Get local environment conditions for this bacterium
      const localEnvironment = {
        ...this.environment,
        nutrients: this.environment.getNutrientAt(bacterium.x, bacterium.y),
        toxicity: this.environment.getToxicityAt(bacterium.x, bacterium.y)
      };
      
      // Update bacterium
      const alive = bacterium.update(localEnvironment);
      
      if (alive) {
        newBacteria.push(bacterium);
        
        // Check for reproduction
        if (this.bacteria.length < this.environment.carryingCapacity) {
          const child = bacterium.reproduce(localEnvironment);
          if (child) {
            newBacteria.push(child);
          }
        }
      }
    }
    
    this.bacteria = newBacteria;
    
    // If population is extinct, optionally restart
    if (this.bacteria.length === 0) {
      console.log("Population extinct at generation", this.environment.generation);
    }
    
    return this.getState();
  }
  
  /**
   * Get current simulation state
   * @returns {Object} - Current state
   */
  getState() {
    return {
      bacteria: this.bacteria,
      environment: this.environment,
      running: this.running,
      speed: this.speed,
      statistics: this.environment.getStatistics()
    };
  }
  
  /**
   * Set environment parameters
   * @param {Object} params - New parameters
   */
  setEnvironmentParameters(params) {
    console.log("Setting environment parameters:", params);
    this.environment.setParameters(params);
  }
  
  /**
   * Set initial bacteria parameters
   * @param {Object} params - New parameters
   */
  setInitialBacteriaParameters(params) {
    this.initialBacteriaParams = {
      ...this.initialBacteriaParams,
      ...params
    };
    console.log("Setting initial bacteria parameters:", this.initialBacteriaParams);
  }
  
  /**
   * Set initial population size
   * @param {number} size - New population size
   */
  setInitialPopulation(size) {
    this.initialPopulation = size;
    console.log("Setting initial population size:", size);
  }
  
  /**
   * Draw the simulation on a canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Drawing options
   */
  draw(ctx, options = {}) {
    // Draw environment
    this.environment.draw(ctx, options);
    
    // Draw bacteria
    for (const bacterium of this.bacteria) {
      bacterium.draw(ctx);
    }
  }
}

export default Simulation;


