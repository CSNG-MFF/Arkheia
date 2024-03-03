const express = require('express');
const {
  getResults,
  createResult,
  deleteResult,
  getResultsForSimulation
} = require('../controllers/resultsController'); // Import the stimulus controller functions

const router = express.Router();

router.get('/', getResults); // Route to get all stimuli

router.post('/', createResult); // Route to create a new stimulus

router.delete('/:id', deleteResult); // Route to delete a stimulus by ID

router.get('/:id', getResultsForSimulation); // Route to get stimuli for the whole simulation

module.exports = router;
