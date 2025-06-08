/**
 * Environment class to manage environmental conditions for the bacteria simulation
 */
class Environment {
  /**
   * Create a new environment
   * @param {Object} options - Configuration options
   * @param {number} options.width - Width of the environment
   * @param {number} options.height - Height of the environment
   * @param {number} options.temperature - Temperature (0-100)
   * @param {number} options.pH - pH level (0-14)
   * @param {number} options.nutrients - Nutrient availability (0-10)
   * @param {number} options.toxicity - Toxicity level (0-1)
   * @param {number} options.antibiotics - Antibiotic level (0-1)
   * @param {number} options.carryingCapacity - Maximum population size
   */
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.temperature = options.temperature !== undefined ? options.temperature : 50;
    this.pH = options.pH !== undefined ? options.pH : 7;
    this.nutrients = options.nutrients !== undefined ? options.nutrients : 5;
    this.toxicity = options.toxicity !== undefined ? options.toxicity : 0;
    this.antibiotics = options.antibiotics !== undefined ? options.antibiotics : 0;
    this.carryingCapacity = options.carryingCapacity || 200;
    
    // Internal state
    this.initializeDistributions(); // Call a dedicated method for initialization
    this.generation = 0;
    
    // Statistics
    this.statistics = {
      populationHistory: [],
      averageTraits: {
        size: [],
        speed: [],
        metabolism: [],
        resistance: [],
        lifespan: [],
        mutationRate: []
      },
      extinctionEvents: []
    };
    console.log("Environment initialized with width:", this.width, "height:", this.height);
  }
  
  /**
   * Initialize or re-initialize nutrient and toxicity distributions
   */
  initializeDistributions() {
    console.log("Initializing distributions for width:", this.width, "height:", this.height);
    this.nutrientDistribution = this.generateNutrientDistribution();
    this.toxicityDistribution = this.generateToxicityDistribution();
    console.log("Nutrient grid initialized:", this.nutrientDistribution.grid.length, "x", this.nutrientDistribution.grid[0].length);
    console.log("Toxicity grid initialized:", this.toxicityDistribution.grid.length, "x", this.toxicityDistribution.grid[0].length);
  }

  /**
   * Generate a random distribution of nutrients across the environment
   * @returns {Object} - Grid and cell dimensions
   */
  generateNutrientDistribution() {
    const gridSize = 20;
    const cellWidth = this.width / gridSize;
    const cellHeight = this.height / gridSize;
    
    const grid = [];
    
    for (let x = 0; x < gridSize; x++) {
      grid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        // Base nutrient level with some random variation
        grid[x][y] = this.nutrients * (0.5 + Math.random());
        
        // Create some nutrient-rich and nutrient-poor areas
        if (Math.random() < 0.1) {
          grid[x][y] *= 2; // Rich area
        } else if (Math.random() < 0.1) {
          grid[x][y] *= 0.5; // Poor area
        }
      }
    }
    console.log("Generated nutrient grid:", grid.length, "x", grid[0].length);
    return {
      grid,
      cellWidth,
      cellHeight,
      gridSize
    };
  }
  
  /**
   * Generate a random distribution of toxicity across the environment
   * @returns {Object} - Grid and cell dimensions
   */
  generateToxicityDistribution() {
    const gridSize = 20;
    const cellWidth = this.width / gridSize;
    const cellHeight = this.height / gridSize;
    
    const grid = [];
    
    for (let x = 0; x < gridSize; x++) {
      grid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        // Base toxicity level with some random variation
        grid[x][y] = this.toxicity * (0.5 + Math.random());
        
        // Create some highly toxic areas
        if (Math.random() < 0.05) {
          grid[x][y] *= 3; // Toxic hotspot
        }
      }
    }
    console.log("Generated toxicity grid:", grid.length, "x", grid[0].length);
    return {
      grid,
      cellWidth,
      cellHeight,
      gridSize
    };
  }
  
  /**
   * Update the environment for one simulation step
   * @param {Array} bacteria - Current bacteria population
   */
  update(bacteria) {
    this.generation++;
    
    // Update statistics
    this.updateStatistics(bacteria);
    
    // Occasionally redistribute nutrients
    if (this.generation % 100 === 0) {
      this.nutrientDistribution = this.generateNutrientDistribution();
    }
    
    // Occasionally redistribute toxicity
    if (this.generation % 150 === 0) {
      this.toxicityDistribution = this.generateToxicityDistribution();
    }
    
    // Check for extinction events
    const currentPopulation = bacteria.length;
    const previousPopulation = this.statistics.populationHistory.length > 0 
      ? this.statistics.populationHistory[this.statistics.populationHistory.length - 1] 
      : currentPopulation;
    
    if (previousPopulation > 10 && currentPopulation <= previousPopulation * 0.5) {
      this.statistics.extinctionEvents.push({
        generation: this.generation,
        previousPopulation,
        currentPopulation
      });
    }
  }
  
  /**
   * Update statistics based on current bacteria population
   * @param {Array} bacteria - Current bacteria population
   */
  updateStatistics(bacteria) {
    // Update population history
    this.statistics.populationHistory.push(bacteria.length);
    
    // Limit history length to prevent memory issues
    if (this.statistics.populationHistory.length > 1000) {
      this.statistics.populationHistory.shift();
    }
    
    // Calculate average traits
    if (bacteria.length > 0) {
      const averages = {
        size: 0,
        speed: 0,
        metabolism: 0,
        resistance: 0,
        lifespan: 0,
        mutationRate: 0
      };
      
      bacteria.forEach(bacterium => {
        averages.size += bacterium.size;
        averages.speed += bacterium.speed;
        averages.metabolism += bacterium.metabolism;
        averages.resistance += bacterium.resistance;
        averages.lifespan += bacterium.lifespan;
        averages.mutationRate += bacterium.mutationRate;
      });
      
      // Calculate averages
      for (const trait in averages) {
        averages[trait] /= bacteria.length;
        this.statistics.averageTraits[trait].push(averages[trait]);
        
        // Limit history length
        if (this.statistics.averageTraits[trait].length > 1000) {
          this.statistics.averageTraits[trait].shift();
        }
      }
    }
  }
  
  /**
   * Get nutrient level at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {number} - Nutrient level at position
   */
  getNutrientAt(x, y) {
    console.log("getNutrientAt called for x:", x, "y:", y);
    console.log("nutrientDistribution:", this.nutrientDistribution);
    const { grid, cellWidth, cellHeight, gridSize } = this.nutrientDistribution;
    
    // Convert position to grid coordinates
    const gridX = Math.min(Math.floor(x / cellWidth), gridSize - 1);
    const gridY = Math.min(Math.floor(y / cellHeight), gridSize - 1);
    
    console.log("gridX:", gridX, "gridY:", gridY, "grid length:", grid.length);
    if (!grid || !grid[gridX] || grid[gridX][gridY] === undefined) {
      console.error("Error: Invalid grid access in getNutrientAt. grid:", grid, "gridX:", gridX, "gridY:", gridY);
      return 0; // Return a default value to prevent crash
    }
    return grid[gridX][gridY];
  }
  
  /**
   * Get toxicity level at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {number} - Toxicity level at position
   */
  getToxicityAt(x, y) {
    console.log("getToxicityAt called for x:", x, "y:", y);
    console.log("toxicityDistribution:", this.toxicityDistribution);
    const { grid, cellWidth, cellHeight, gridSize } = this.toxicityDistribution;
    
    // Convert position to grid coordinates
    const gridX = Math.min(Math.floor(x / cellWidth), gridSize - 1);
    const gridY = Math.min(Math.floor(y / cellHeight), gridSize - 1);
    
    console.log("gridX:", gridX, "gridY:", gridY, "grid length:", grid.length);
    if (!grid || !grid[gridX] || grid[gridX][gridY] === undefined) {
      console.error("Error: Invalid grid access in getToxicityAt. grid:", grid, "gridX:", gridX, "gridY:", gridY);
      return 0; // Return a default value to prevent crash
    }
    return grid[gridX][gridY];
  }
  
  /**
   * Draw the environment on a canvas context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Drawing options
   * @param {boolean} options.showNutrients - Whether to show nutrient distribution
   * @param {boolean} options.showToxicity - Whether to show toxicity distribution
   */
  draw(ctx, options = {}) {
    const { showNutrients = true, showToxicity = true } = options;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.width, this.height);
    
    if (showNutrients) {
      this.drawNutrientDistribution(ctx);
    }
    
    if (showToxicity) {
      this.drawToxicityDistribution(ctx);
    }
  }
  
  /**
   * Draw nutrient distribution on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawNutrientDistribution(ctx) {
    const { grid, cellWidth, cellHeight, gridSize } = this.nutrientDistribution;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const nutrientLevel = grid[x][y];
        const normalizedLevel = nutrientLevel / (this.nutrients * 2);
        
        // Draw nutrient level as green with varying opacity
        ctx.fillStyle = `rgba(0, 128, 0, ${normalizedLevel * 0.3})`;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
  
  /**
   * Draw toxicity distribution on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawToxicityDistribution(ctx) {
    const { grid, cellWidth, cellHeight, gridSize } = this.toxicityDistribution;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const toxicityLevel = grid[x][y];
        const normalizedLevel = toxicityLevel / (this.toxicity * 3);
        
        if (normalizedLevel > 0.1) {
          // Draw toxicity level as red with varying opacity
          ctx.fillStyle = `rgba(255, 0, 0, ${normalizedLevel * 0.3})`;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }
  
  /**
   * Set environment parameters
   * @param {Object} params - New parameters
   */
  setParameters(params) {
    let distributionsNeedRegen = false;

    if (params.temperature !== undefined) this.temperature = params.temperature;
    if (params.pH !== undefined) this.pH = params.pH;
    if (params.nutrients !== undefined) {
      this.nutrients = params.nutrients;
      distributionsNeedRegen = true; // Regenerate if nutrient level changes
    }
    if (params.toxicity !== undefined) {
      this.toxicity = params.toxicity;
      distributionsNeedRegen = true; // Regenerate if toxicity level changes
    }
    if (params.antibiotics !== undefined) this.antibiotics = params.antibiotics;
    if (params.carryingCapacity !== undefined) this.carryingCapacity = params.carryingCapacity;
    
    // Update width and height and regenerate distributions if they change
    if (params.width !== undefined && params.width !== this.width) {
      this.width = params.width;
      distributionsNeedRegen = true;
    }
    if (params.height !== undefined && params.height !== this.height) {
      this.height = params.height;
      distributionsNeedRegen = true;
    }

    if (distributionsNeedRegen) {
      this.initializeDistributions(); // Regenerate both if any relevant parameter changes
    }
  }
  
  /**
   * Get current statistics
   * @returns {Object} - Current statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      generation: this.generation,
      currentParameters: {
        temperature: this.temperature,
        pH: this.pH,
        nutrients: this.nutrients,
        toxicity: this.toxicity,
        antibiotics: this.antibiotics,
        carryingCapacity: this.carryingCapacity,
        width: this.width, // Add width to currentParameters
        height: this.height // Add height to currentParameters
      }
    };
  }
}

export default Environment;


