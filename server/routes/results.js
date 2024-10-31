const express = require('express');
const {
  getResults,
  createResult,
  deleteResult,
  getResultsForSimulation
} = require('../controllers/resultsController');

const {
  getFigureForResult
} = require('../controllers/fileGridfsController');

const router = express.Router();
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

router.get('/', getResults); // Route to get all results

router.post('/', checkDatabaseWriteEnabled, createResult); // Route to create a new result

router.delete('/:id', checkDatabaseWriteEnabled, deleteResult); // Route to delete a result by ID

router.get('/:id', getResultsForSimulation); // Route to get results for the whole simulation

router.get('/:id/image', getFigureForResult); // Route to get the figure of a result

module.exports = router;
