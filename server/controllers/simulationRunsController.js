const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Stimulus = require('../models/stimuli_model');
const ExpProtocol = require('../models/exp_protocol_model');
const Record = require('../models/records_model');
const Result = require('../models/results_model');

/**
 * Gets all the simulations
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with an array of simulations
 */
const getSimulations = async (req, res) => {
  const simulations = await Simulation.find({ from_parameter_search: false }).sort({ createdAt: -1 });

  res.status(200).json(simulations)
};

/**
 * Updates one simulation
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the updated simulation
 */
const updateSimulation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const simulation = await Simulation.findByIdAndUpdate(id, {
    ...req.body
  }, { new: true }); // Option to return the updated document

  if (!simulation) {
    return res.status(400).json({ error: 'No such simulation' });
  }

  res.status(200).json(simulation);
};

/**
 * Creates a simulation
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the created simulation
 */
const createSimulation = async (req, res) => {
  const {simulation_run_name, model_name, creation_data, model_description, parameters, stimuliIds, expProtocolIds, recordIds, resultIds, from_parameter_search } = req.body
    // Add to database
    try {
      const stimuli = await Stimulus.find({ _id: { $in: stimuliIds } });
      const exp_protocols = await ExpProtocol.find({ _id: { $in: expProtocolIds } });
      const records = await Record.find({ _id: { $in: recordIds } });
      const results = await Result.find({ _id: { $in: resultIds } });
      const simulation = await Simulation.create({
        from_parameter_search,
        simulation_run_name, 
        model_name, 
        creation_data, 
        model_description, 
        parameters,
        stimuli: stimuli.map(stimulus => stimulus._id),
        exp_protocols: exp_protocols.map(exp_protocol => exp_protocol._id),
        records: records.map(record => record._id),
        results: results.map(result => result._id)
      })
      res.status(200).json(simulation)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
};

/**
 * Delete a simulation
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the deleted simulation
 */
const deleteSimulation = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Bad format of ID'});
  }

  const simulation = await Simulation.findOne({ _id : id });

  if (!simulation) {
    return res.status(400).json({error: 'No such simulation'});
  }

  // Delete the components connected with the simulation
  await Stimulus.deleteMany({ '_id': { $in: simulation.stimuli } });
  await ExpProtocol.deleteMany({ '_id': { $in: simulation.exp_protocols } });
  await Record.deleteMany({ '_id': { $in: simulation.records } });
  await Result.deleteMany({ '_id': { $in: simulation.results } });

  // Finally, delete the simulation itself
  await Simulation.deleteOne({ '_id': simulation._id });

  res.status(200).json({ message: 'Simulation and all associated data deleted successfully' });
};

/**
 * Gets one simulation
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the found simulation
 */
const getSimulation = async (req, res) => {
  const { id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'Bad format of ID'})
  }

  const simulation = await Simulation.findOne({ _id : id})

  if (!simulation) {
      return res.status(400).json({error: 'No such simulation'})
  }

  res.status(200).json(simulation)
}



module.exports = {
  getSimulations,
  createSimulation,
  deleteSimulation,
  getSimulation,
  updateSimulation
};
