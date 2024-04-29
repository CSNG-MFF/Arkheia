const express = require('express')
const {
    createSimulation,
    getSimulations,
    deleteSimulation,
    getSimulation,
    updateSimulation
} = require('../controllers/simulationRunsController')
 
const router = express.Router()

router.get('/', (getSimulations))

router.post('/', createSimulation)

router.delete('/:id', deleteSimulation)

router.get('/:id', getSimulation)

router.put('/:id', updateSimulation)

module.exports = router