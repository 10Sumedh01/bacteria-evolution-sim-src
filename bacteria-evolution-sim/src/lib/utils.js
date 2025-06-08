/**
 * Utility functions for the bacteria evolution simulation
 */

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} - Mapped value
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Calculate the average of an array of numbers
 * @param {Array<number>} values - Array of values
 * @returns {number} - Average value
 */
export const average = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate the median of an array of numbers
 * @param {Array<number>} values - Array of values
 * @returns {number} - Median value
 */
export const median = (values) => {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

/**
 * Calculate the standard deviation of an array of numbers
 * @param {Array<number>} values - Array of values
 * @returns {number} - Standard deviation
 */
export const standardDeviation = (values) => {
  if (values.length === 0) return 0;
  
  const avg = average(values);
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  return Math.sqrt(average(squareDiffs));
};

/**
 * Format a number with specified precision
 * @param {number} value - Value to format
 * @param {number} precision - Number of decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (value, precision = 2) => {
  return value.toFixed(precision);
};

/**
 * Generate a random color
 * @returns {string} - Random color in hex format
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Generate a color based on a value in a range
 * @param {number} value - Value to map to color
 * @param {number} min - Minimum value in range
 * @param {number} max - Maximum value in range
 * @returns {string} - Color in hsl format
 */
export const valueToColor = (value, min, max) => {
  // Map value to hue (0-240, blue to red)
  const hue = mapRange(value, min, max, 240, 0);
  return `hsl(${hue}, 100%, 50%)`;
};

/**
 * Calculate distance between two points
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} - Distance between points
 */
export const distance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get dominant trait from a population of bacteria
 * @param {Array} bacteria - Array of bacteria
 * @param {string} trait - Trait to analyze
 * @returns {Object} - Dominant trait value and percentage
 */
export const getDominantTrait = (bacteria, trait) => {
  if (bacteria.length === 0) {
    return { value: 0, percentage: 0 };
  }
  
  // Group bacteria by trait value (rounded to 1 decimal place)
  const groups = {};
  
  bacteria.forEach(bacterium => {
    const value = Math.round(bacterium[trait] * 10) / 10;
    groups[value] = (groups[value] || 0) + 1;
  });
  
  // Find the most common value
  let dominantValue = 0;
  let maxCount = 0;
  
  for (const value in groups) {
    if (groups[value] > maxCount) {
      maxCount = groups[value];
      dominantValue = parseFloat(value);
    }
  }
  
  const percentage = (maxCount / bacteria.length) * 100;
  
  return {
    value: dominantValue,
    percentage
  };
};

/**
 * Calculate trait distribution in a population
 * @param {Array} bacteria - Array of bacteria
 * @param {string} trait - Trait to analyze
 * @param {number} bins - Number of bins for distribution
 * @returns {Array} - Distribution data
 */
export const getTraitDistribution = (bacteria, trait, bins = 10) => {
  if (bacteria.length === 0) {
    return Array(bins).fill(0);
  }
  
  // Find min and max values
  let min = Infinity;
  let max = -Infinity;
  
  bacteria.forEach(bacterium => {
    min = Math.min(min, bacterium[trait]);
    max = Math.max(max, bacterium[trait]);
  });
  
  // Add a small buffer to max
  max += (max - min) * 0.01;
  
  // Initialize bins
  const distribution = Array(bins).fill(0);
  
  // Count bacteria in each bin
  bacteria.forEach(bacterium => {
    const binIndex = Math.min(
      Math.floor(mapRange(bacterium[trait], min, max, 0, bins)),
      bins - 1
    );
    distribution[binIndex]++;
  });
  
  return {
    distribution,
    min,
    max
  };
};

/**
 * Generate preset environmental conditions
 * @param {string} preset - Preset name
 * @returns {Object} - Environmental parameters
 */
export const getEnvironmentPreset = (preset) => {
  const presets = {
    neutral: {
      temperature: 50,
      pH: 7,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 200
    },
    hot: {
      temperature: 80,
      pH: 7,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 200
    },
    cold: {
      temperature: 20,
      pH: 7,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 200
    },
    acidic: {
      temperature: 50,
      pH: 3,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 200
    },
    alkaline: {
      temperature: 50,
      pH: 11,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 200
    },
    nutrientRich: {
      temperature: 50,
      pH: 7,
      nutrients: 10,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 300
    },
    nutrientPoor: {
      temperature: 50,
      pH: 7,
      nutrients: 2,
      toxicity: 0,
      antibiotics: 0,
      carryingCapacity: 100
    },
    toxic: {
      temperature: 50,
      pH: 7,
      nutrients: 5,
      toxicity: 0.5,
      antibiotics: 0,
      carryingCapacity: 150
    },
    antibiotic: {
      temperature: 50,
      pH: 7,
      nutrients: 5,
      toxicity: 0,
      antibiotics: 0.5,
      carryingCapacity: 150
    },
    extreme: {
      temperature: 85,
      pH: 2,
      nutrients: 3,
      toxicity: 0.3,
      antibiotics: 0.3,
      carryingCapacity: 100
    }
  };
  
  return presets[preset] || presets.neutral;
};

/**
 * Generate preset bacteria parameters
 * @param {string} preset - Preset name
 * @returns {Object} - Bacteria parameters
 */
export const getBacteriaPreset = (preset) => {
  const presets = {
    balanced: {
      size: 5,
      speed: 1,
      metabolism: 1,
      resistance: 1,
      lifespan: 100,
      mutationRate: 0.1
    },
    large: {
      size: 8,
      speed: 0.7,
      metabolism: 1.5,
      resistance: 1.2,
      lifespan: 120,
      mutationRate: 0.08
    },
    small: {
      size: 3,
      speed: 1.3,
      metabolism: 0.8,
      resistance: 0.8,
      lifespan: 80,
      mutationRate: 0.12
    },
    fast: {
      size: 4,
      speed: 2,
      metabolism: 1.2,
      resistance: 0.9,
      lifespan: 90,
      mutationRate: 0.1
    },
    efficient: {
      size: 5,
      speed: 0.8,
      metabolism: 0.6,
      resistance: 1.1,
      lifespan: 130,
      mutationRate: 0.08
    },
    resistant: {
      size: 6,
      speed: 0.9,
      metabolism: 1.1,
      resistance: 2,
      lifespan: 110,
      mutationRate: 0.09
    },
    mutable: {
      size: 5,
      speed: 1,
      metabolism: 1,
      resistance: 1,
      lifespan: 100,
      mutationRate: 0.3
    },
    stable: {
      size: 5,
      speed: 1,
      metabolism: 1,
      resistance: 1,
      lifespan: 100,
      mutationRate: 0.03
    }
  };
  
  return presets[preset] || presets.balanced;
};


/**
 * Conditionally join class names
 * @param {...string} classes - Class names to join
 * @returns {string} - Joined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

