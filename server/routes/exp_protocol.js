const express = require('express');
const {
  getExpProtocols,
  createExpProtocol,
  deleteExpProtocol,
  getExpProtocolForSimulation
} = require('../controllers/ExpProtocolController'); // Import the stimulus controller functions

const router = express.Router();

router.get('/', getExpProtocols); // Route to get all stimuli

router.post('/', createExpProtocol); // Route to create a new stimulus

router.delete('/:id', deleteExpProtocol); // Route to delete a stimulus by ID

router.get('/:id', getExpProtocolForSimulation); // Route to get stimuli for the whole simulation

module.exports = router;
