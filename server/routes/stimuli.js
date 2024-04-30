const express = require('express');
const {
    createStimulus,
    getStimuli,
    deleteStimulus,
    getStimuliForSimulation
} = require('../controllers/stimuliController'); // Import the stimulus controller functions

const {
    getMovieForStimulus
  } = require('../controllers/fileGridfsController');

const router = express.Router();

router.get('/', getStimuli); // Route to get all stimuli

router.post('/', createStimulus); // Route to create a new stimulus

router.delete('/:id', deleteStimulus); // Route to delete a stimulus by ID

router.get('/:id', getStimuliForSimulation); // Route to get stimuli for the whole simulation

router.get('/:id/image', getMovieForStimulus); // Route to get the movie of the stimulus

module.exports = router;
