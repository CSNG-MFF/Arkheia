const express = require('express')
const {
  getParameterSearches,
  createParameterSearch,
  deleteParameterSearch,
  getParameterSearch,
  getParameterSearchSimulations,
  getParameterSearchResults,
  updateParameterSearch
} = require('../controllers/parameterSearchController')
 
const router = express.Router()
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

router.get('/', getParameterSearches) // Route to get all parameter searches

router.post('/', checkDatabaseWriteEnabled, createParameterSearch) // Route to create a parameter search

router.delete('/:id', checkDatabaseWriteEnabled, deleteParameterSearch) // Route to delete a parameter search by ID

router.get('/:id', getParameterSearch) // Route to get a parameter search

router.get('/:id/simulations', getParameterSearchSimulations) // Route to get all the simulations associated with the parameter search

router.get('/:id/results', getParameterSearchResults) // Route to get the results for all the simulations associated with the parameter search

router.get('/:id', updateParameterSearch) // Route to update the parameter search

module.exports = router