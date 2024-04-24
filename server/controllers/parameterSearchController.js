const mongoose = require('mongoose');
const ParameterSearch = require('../models/parameter_search_model');
const Simulation = require('../models/simulation_run_model');

// Get all parameter searches
const getParameterSearches = async (req, res) => {
  const parameterSearches = await ParameterSearch.find({}).sort({createdAt: -1})

  res.status(200).json(parameterSearches)
};

// Create parameter search with file upload
const createParameterSearch = async (req, res) => {
  const {name, model_name, run_date, simulationIds, parameter_combinations } = req.body
    //add to db
    try {
      const simulations = await Simulation.find({ _id: { $in: simulationIds }});
      const parameter_search = await ParameterSearch.create({
        name,
        model_name, 
        run_date, 
        simulations: simulations.map(simulation => simulation._id),
        parameter_combinations
      })
      res.status(200).json(parameter_search)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
};

//delete a a parameter search
const deleteParameterSearch = async (req, res) => {
  const { id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'Bad format of ID'})
  }

  const parameter_search = await ParameterSearch.findOneAndDelete({ _id : id})

  if (!parameter_search) {
      return res.status(400).json({error: 'No such parameter search'})
  }

  res.status(200).json(parameter_search)
}

const getParameterSearch = async (req, res) => {
  const { id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'Bad format of ID'})
  }

  const parameter_search = await ParameterSearch.findOne({ _id : id})

  if (!parameter_search) {
      return res.status(400).json({error: 'No such simulation'})
  }

  res.status(200).json(parameter_search)
}

const getParameterSearchSimulations = async (req, res) => {
  const parameterSearchId = req.params.id;
  try {
    const parameterSearch = await ParameterSearch.findById(parameterSearchId);
    
    if (!parameterSearch) {
      return res.status(404).json({ error: 'Parameter search not found' });
    }
    
    const simulations = await Simulation.find({ _id: { $in: parameterSearch.simulations } });
    
    res.json(simulations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

const getParameterSearchResults = async (req, res) => {
  try {
    const parameterSearch = await ParameterSearch.findById(req.params.id).populate('simulations');
    if (!parameterSearch) {
      return res.status(404).json({ message: 'ParameterSearch not found' });
    }

    const simulations = await Simulation.find({ '_id': { $in: parameterSearch.simulations } }).populate('results');
    const results = simulations.map(simulation => simulation.results);

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



module.exports = {
  getParameterSearches,
  createParameterSearch,
  deleteParameterSearch,
  getParameterSearch,
  getParameterSearchSimulations,
  getParameterSearchResults
};
