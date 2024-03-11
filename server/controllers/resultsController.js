const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Result = require('../models/results_model');

// Get all results
const getResults = async (req, res) => {
  const result = await Result.find({}).sort({ createdAt: -1 });

  res.status(200).json(result);
};

// Create a result
const createResult = async (req, res) => {
  const { code_name, name, parameters, caption, figure } = req.body;
  
  try {
    const base64Data = figure.replace(/^data:image\/png;base64,/, '');
    const figureBuffer = Buffer.from(base64Data, 'base64');
    const result = await Result.create({ code_name, name, parameters, caption,
      figure: { data: figureBuffer, contentType: 'image/png' }
    });
    result.figure.data = Buffer.from(result.figure.data).toString('base64');
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a result
const deleteResult = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const result = await Result.findOneAndDelete({ _id: id });

  if (!result) {
    return res.status(400).json({ error: 'No such result' });
  }

  res.status(200).json(result);
};

// Get a result by ID
const getResultsForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('results');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    
    res.status(200).json(simulation.results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getResults,
  createResult,
  deleteResult,
  getResultsForSimulation
};
