const express = require('express')
const {
    createSimulation,
    getSimulations,
    deleteSimulation,
    getSimulation,
    updateSimulation
} = require('../controllers/simulationRunsController')
 
const router = express.Router()

router.get('/', getSimulations) // Route to get all simulations

router.post('/', createSimulation) // Route to create a simulation

router.delete('/:id', deleteSimulation) // Route to delete a simulation

router.get('/:id', getSimulation) // Route to get one simulation

router.put('/:id', updateSimulation) // Route to update a simulation

module.exports = router