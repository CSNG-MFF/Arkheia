const express = require('express')
const {
    createSimulation,
    getSimulations,
    deleteSimulation,
    getSimulation
} = require('../controllers/simulationRunsController')
 
const router = express.Router()

router.get('/', (getSimulations))

router.post('/', createSimulation)

router.delete('/:id', deleteSimulation)

router.get('/:id', getSimulation)

module.exports = router