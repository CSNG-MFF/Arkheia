const express = require('express')
const {
  getParameterSearches,
  createParameterSearch,
  deleteParameterSearch,
  getParameterSearch,
  getParameterSearchSimulations
} = require('../controllers/parameterSearchController')
 
const router = express.Router()

router.get('/', (getParameterSearches))

router.post('/', createParameterSearch)

router.delete('/:id', deleteParameterSearch)

router.get('/:id', getParameterSearch)

router.get('/:id/simulations', getParameterSearchSimulations)

module.exports = router