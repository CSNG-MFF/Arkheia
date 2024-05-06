const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const ExpProtocol = require('../models/exp_protocol_model');

// Get all experimental protocols
const getExpProtocols = async (req, res) => {
  const exp_protocol = await ExpProtocol.find({}).sort({ createdAt: -1 });
  res.status(200).json(exp_protocol);
};

// Create an experimental protocol
const createExpProtocol = async (req, res) => {
  const { code_name, short_description, long_description, parameters } = req.body;

  try {
    const exp_protocol = await ExpProtocol.create({ code_name, short_description, long_description, parameters });
    res.status(200).json(exp_protocol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an experimental protocol
const deleteExpProtocol = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const exp_protocol = await ExpProtocol.findOneAndDelete({ _id: id });

  if (!exp_protocol) {
    return res.status(400).json({ error: 'No such experimental protocol' });
  }

  res.status(200).json(exp_protocol);
};

// Get the experimental protocols associated with a simulation
const getExpProtocolForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('exp_protocols');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    res.status(200).json(simulation.exp_protocols);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getExpProtocols,
  createExpProtocol,
  deleteExpProtocol,
  getExpProtocolForSimulation
};
