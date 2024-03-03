const express = require('express');
const {
  getRecords,
  createRecord,
  deleteRecord,
  getRecordsForSimulation
} = require('../controllers/recordsController'); // Import the stimulus controller functions

const router = express.Router();

router.get('/', getRecords); // Route to get all stimuli

router.post('/', createRecord); // Route to create a new stimulus

router.delete('/:id', deleteRecord); // Route to delete a stimulus by ID

router.get('/:id', getRecordsForSimulation); // Route to get stimuli for the whole simulation

module.exports = router;
