const express = require('express');
const {
    createStimulus,
    getStimuli,
    deleteStimulus,
    getStimulus
} = require('../controllers/stimuliController'); // Import the stimulus controller functions

const router = express.Router();

router.get('/', getStimuli); // Route to get all stimuli

router.post('/', createStimulus); // Route to create a new stimulus

router.delete('/:id', deleteStimulus); // Route to delete a stimulus by ID

router.get('/:id', getStimulus); // Route to get a stimulus by ID

module.exports = router;
