# Bacteria Evolution Simulation

An interactive simulation of a bacteria colony evolving under different environmental conditions. This simulation allows you to observe how bacteria adapt to various environmental factors through natural selection and mutation.

## Features

- **Interactive Visualization**: Watch bacteria move, feed, reproduce, and evolve in real-time
- **Adjustable Parameters**: Modify environmental conditions and bacteria traits
- **Environmental Presets**: Choose from various preset environments (Hot, Cold, Acidic, etc.)
- **Bacteria Presets**: Select different bacteria types with unique characteristics
- **Statistics Tracking**: Monitor population size, trait evolution, and extinction events
- **Responsive Design**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Clone the repository or extract the provided files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
pnpm install
```

### Running the Simulation

Start the development server:

```bash
npm run dev
# or
pnpm run dev
```

Open your browser and navigate to `http://localhost:5173/` (or the URL shown in your terminal).

## How to Use

### Simulation Controls

- **Start/Pause**: Begin or pause the simulation
- **Reset**: Reset the simulation to its initial state
- **Simulation Speed**: Adjust how fast the simulation runs
- **Show Nutrients/Toxicity**: Toggle visibility of environmental factors

### Environment Parameters

- **Temperature**: Affects bacteria metabolism and energy consumption
- **pH Level**: Influences bacteria survival and reproduction
- **Nutrients**: Controls available food resources
- **Toxicity**: Adds harmful elements to the environment
- **Antibiotics**: Challenges bacteria to develop resistance
- **Carrying Capacity**: Maximum sustainable population size

### Bacteria Parameters

- **Initial Population**: Number of bacteria at the start
- **Size**: Physical size of bacteria (affects energy needs)
- **Speed**: Movement speed (faster uses more energy)
- **Metabolism**: Rate of energy consumption
- **Resistance**: Ability to withstand harsh conditions
- **Lifespan**: Maximum age of bacteria
- **Mutation Rate**: Frequency and magnitude of mutations

## Understanding the Simulation

### Evolution Mechanics

Bacteria in this simulation evolve through:

1. **Natural Selection**: Bacteria with traits better suited to the environment survive longer and reproduce more
2. **Mutation**: Offspring have slightly different traits than their parents
3. **Adaptation**: Over generations, the population adapts to environmental conditions

### Visualization

- **Green Dots**: Individual bacteria
- **Green Background**: Nutrient-rich areas
- **Red Background**: Toxic areas
- **Size of Dots**: Represents bacteria size
- **Movement Speed**: Reflects bacteria speed trait

### Statistics

The statistics panel shows:

- **Population**: Current number of bacteria and historical trend
- **Traits**: Average values of different traits in the population
- **Events**: Significant events like population crashes

## Project Structure

- `src/lib/`: Core simulation logic
  - `Bacterium.js`: Bacteria class definition
  - `Environment.js`: Environment class definition
  - `Simulation.js`: Main simulation controller
  - `utils.js`: Utility functions
- `src/hooks/`: React hooks for simulation management
  - `useAnimationFrame.js`: Animation loop hook
  - `useSimulation.js`: Simulation state management hook
- `src/components/`: React components
  - `SimulationCanvas.jsx`: Canvas visualization component
  - `ControlPanel.jsx`: Main control panel component
  - `EnvironmentControls.jsx`: Environment parameter controls
  - `BacteriaControls.jsx`: Bacteria parameter controls
  - `SimulationControls.jsx`: Simulation execution controls
  - `StatisticsPanel.jsx`: Statistics display component

## License

This project is provided for educational and demonstration purposes.

## Acknowledgments

- Built with React and Vite
- UI components from shadcn/ui
- Charts from Recharts

