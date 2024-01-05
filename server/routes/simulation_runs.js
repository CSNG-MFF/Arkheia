const express = require('express')
const {
    createSimulation,
    getSimulations,
    deleteSimulation
} = require('../controllers/simulationRunsController')
 
const router = express.Router()

router.get('/', (getSimulations))

router.post('/', createSimulation)

router.delete('/:id', deleteSimulation)

module.exports = router