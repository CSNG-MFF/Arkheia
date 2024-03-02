const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Stimuli = require('../models/stimuli_model'); // Import the Stimuli model

// Get all stimuli
const getStimuli = async (req, res) => {
  const stimuli = await Stimuli.find({}).sort({ createdAt: -1 });

  res.status(200).json(stimuli);
};

// Create a stimulus
const createStimulus = async (req, res) => {
  const { code_name, short_description, long_description, parameters, movie } = req.body;
  const base64Data = movie.replace(/^data:image\/gif;base64,/, '');
  const movieBuffer = Buffer.from(base64Data, 'base64');
  try {
    const stimulus = await Stimuli.create({ code_name, short_description, long_description, parameters,
      movie: { data: movieBuffer, contentType: 'image/gif' }
    });
    stimulus.movie.data = Buffer.from(stimulus.movie.data).toString('base64');
    res.status(200).json(stimulus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a stimulus
const deleteStimulus = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const stimulus = await Stimuli.findOneAndDelete({ _id: id });

  if (!stimulus) {
    return res.status(400).json({ error: 'No such stimulus' });
  }

  res.status(200).json(stimulus);
};

// Get a stimulus by ID
const getStimuliForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('stimuli');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }


    /*
    simulation.stimuli.forEach(stimulus => {
      if (stimulus.movie && stimulus.movie.data) {
        stimulus.movie.data = Buffer.from(stimulus.movie.data, 'binary').toString('base64');
      }
    });
    */
    console.log(simulation.stimuli);

    res.status(200).json(simulation.stimuli);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStimuli,
  createStimulus,
  deleteStimulus,
  getStimuliForSimulation
};
