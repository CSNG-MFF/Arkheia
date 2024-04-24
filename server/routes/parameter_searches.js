const express = require('express')
const {
  getParameterSearches,
  createParameterSearch,
  deleteParameterSearch,
  getParameterSearch,
  getParameterSearchSimulations,
  getParameterSearchResults
} = require('../controllers/parameterSearchController')
 
const router = express.Router()

router.get('/', (getParameterSearches))

router.post('/', createParameterSearch)

router.delete('/:id', deleteParameterSearch)

router.get('/:id', getParameterSearch)

router.get('/:id/simulations', getParameterSearchSimulations)

router.get('/:id/results', getParameterSearchResults)

module.exports = router