const Simulation = require('../models/simulation_run_model');
const mongoose = require('mongoose');


// Get all simulations
const getSimulations = async (req, res) => {
  const simulations = await Simulation.find({}).sort({createdAt: -1})

  res.status(200).json(simulations)
};

// Create simulation with file upload
const createSimulation = async (req, res) => {
  const {simulation_run_name, model_name, creation_data, model_description, parameters, /*stimuliIds*/} = req.body
    //add to db
    try {
      //const stimuli = await Stimuli.find({ _id: { $in: stimuliIds } });
      const simulation = await Simulation.create({
        simulation_run_name, 
        model_name, 
        creation_data, 
        model_description, 
        parameters,
        //stimuli: stimuli.map(stimulus => stimulus._id)
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
