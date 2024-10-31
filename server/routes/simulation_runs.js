const express = require('express')
const {
    createSimulation,
    getSimulations,
    deleteSimulation,
    getSimulation,
    updateSimulation
} = require('../controllers/simulationRunsController')
 
const router = express.Router()
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');


router.get('/', getSimulations) // Route to get all simulations

router.post('/', checkDatabaseWriteEnabled, createSimulation) // Route to create a simulation

router.delete('/:id', checkDatabaseWriteEnabled, deleteSimulation) // Route to delete a simulation

router.get('/:id', getSimulation) // Route to get one simulation

router.put('/:id', checkDatabaseWriteEnabled, updateSimulation) // Route to update a simulation

module.exports = router
