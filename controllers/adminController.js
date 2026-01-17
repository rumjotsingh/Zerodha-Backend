// Simple admin controls for simulation
let simulationPaused = false;
let simulationSpeed = 1; // Multiplier for speed

export const pauseSimulation = (req, res) => {
  simulationPaused = true;
  res.json({ message: "Simulation paused" });
};

export const resumeSimulation = (req, res) => {
  simulationPaused = false;
  res.json({ message: "Simulation resumed" });
};

export const setSimulationSpeed = (req, res) => {
  const { speed } = req.body;
  simulationSpeed = speed;
  res.json({ message: `Simulation speed set to ${speed}x` });
};

export const getSimulationStatus = (req, res) => {
  res.json({ paused: simulationPaused, speed: simulationSpeed });
};

export { simulationPaused, simulationSpeed };
