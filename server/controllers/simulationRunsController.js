const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Stimuli = require('../models/stimuli_model');
const ExpProtocol = require('../models/exp_protocol_model');
const Record = require('../models/records_model');
const Result = require('../models/results_model');

// Get all simulations
const getSimulations = async (req, res) => {
  const simulations = await Simulation.find({ from_parameter_search: false }).sort({ createdAt: -1 });

  res.status(200).json(simulations)
};

// Create simulation with file upload
const createSimulation = async (req, res) => {
  const {simulation_run_name, model_name, creation_data, model_description, parameters, stimuliIds, expProtocolIds, recordIds, resultIds, from_parameter_search } = req.body
    //add to db
    try {
      const stimuli = await Stimuli.find({ _id: { $in: stimuliIds } });
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

//delete a simulation
const deleteSimulation = async (req, res) => {
  const { id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'Bad format of ID'})
  }

  const simulation = await Simulation.findOneAndDelete({ _id : id})

  if (!simulation) {
      return res.status(400).json({error: 'No such simulation'})
  }

  res.status(200).json(simulation)
}

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
  getSimulation
};
