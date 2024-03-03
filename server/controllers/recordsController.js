const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Records = require('../models/records_model');

// Get all experimental protocols
const getRecords = async (req, res) => {
  const record = await Records.find({}).sort({ createdAt: -1 });

  res.status(200).json(record);
};

// Create an experimental protocol
const createRecord = async (req, res) => {
  const { code_name, short_description, long_description, parameters, variables, source } = req.body;

  try {
    const record = await Records.create({ code_name, short_description, long_description, parameters, variables, source });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an experimental protocol
const deleteRecord = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const record = await Records.findOneAndDelete({ _id: id });

  if (!record) {
    return res.status(400).json({ error: 'No such stimulus' });
  }

  res.status(200).json(record);
};

// Get a stimulus by ID
const getRecordsForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('records');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    res.status(200).json(simulation.records);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRecords,
  createRecord,
  deleteRecord,
  getRecordsForSimulation
};
