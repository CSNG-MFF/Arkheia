const express = require('express');
const {
  getRecords,
  createRecord,
  deleteRecord,
  getRecordsForSimulation
} = require('../controllers/recordsController'); // Import the stimulus controller functions

const router = express.Router();
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

router.get('/', getRecords); // Route to get all records

router.post('/', checkDatabaseWriteEnabled, createRecord); // Route to create a new record

router.delete('/:id', checkDatabaseWriteEnabled, deleteRecord); // Route to delete a record by ID

router.get('/:id', getRecordsForSimulation); // Route to get records for the whole simulation

module.exports = router;
