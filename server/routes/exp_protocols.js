const express = require('express');
const {
  getExpProtocols,
  createExpProtocol,
  deleteExpProtocol,
  getExpProtocolForSimulation
} = require('../controllers/ExpProtocolController');

const router = express.Router();
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

router.get('/', getExpProtocols); // Route to get all experimental protocols

router.post('/', checkDatabaseWriteEnabled, createExpProtocol); // Route to create a new experimental protocol

router.delete('/:id', checkDatabaseWriteEnabled, deleteExpProtocol); // Route to delete an experimental protocol by ID

router.get('/:id', getExpProtocolForSimulation); // Route to get the experimental protocols for the whole simulation

module.exports = router;
