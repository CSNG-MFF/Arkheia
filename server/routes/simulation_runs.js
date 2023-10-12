const express = require('express')
const {
    createSimulation,
    getSimulations,
    getSimulation,
    updateSimulation,
    deleteSimulation
} = require('../controllers/simulationController')
 
const router = express.Router()

router.get('/', (getSimulations))

router.get('/:id', (getSimulation))

router.post('/', createSimulation)

router.delete('/:id', (deleteSimulation))

router.put('/:id', (updateSimulation))

module.exports = router