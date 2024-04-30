const express = require('express');
const {
  getExpProtocols,
  createExpProtocol,
  deleteExpProtocol,
  getExpProtocolForSimulation
} = require('../controllers/ExpProtocolController'); // Import the stimulus controller functions

const router = express.Router();

router.get('/', getExpProtocols); // Route to get all experimental protocols

router.post('/', createExpProtocol); // Route to create a new experimental protocol

router.delete('/:id', deleteExpProtocol); // Route to delete an experimental protocol by ID

router.get('/:id', getExpProtocolForSimulation); // Route to get the experimental protocols for the whole simulation

module.exports = router;
