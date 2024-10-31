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
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

router.get('/', getStimuli); // Route to get all stimuli

router.post('/', checkDatabaseWriteEnabled, createStimulus); // Route to create a new stimulus

router.delete('/:id', checkDatabaseWriteEnabled, deleteStimulus); // Route to delete a stimulus by ID

router.get('/:id', getStimuliForSimulation); // Route to get stimuli for the whole simulation

router.get('/:id/image', getMovieForStimulus); // Route to get the movie of the stimulus

module.exports = router;
