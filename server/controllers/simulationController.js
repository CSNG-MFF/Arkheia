const Simulation = require('../models/simulations_model')
const mongoose = require('mongoose')

//get all simulations
const getSimulations = async (req, res) => {
    const simulations = await Simulation.find({}).sort({createdAt: -1})

    res.status(200).json(simulations)
}

//get a single simulation
const getSimulation = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Bad format of ID'})
    }

    const simulation = await Simulation.findById(id)

    if (!simulation) {
        return res.status(404).json({error: 'No such simulation'})
    }

    res.status(200).json(simulation)
}

//create simulation
const createSimulation = async (req, res) => {
    const {title, number} = req.body
    //add to db
    try {
        const simulation =  await Simulation.create({title, number})
        res.status(200).json(simulation)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete a simulation
const deleteSimulation = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Bad format of ID'})
    }

    const simulation = await Simulation.findOneAndDelete({ _id : id})

    if (!simulation) {
        return res.status(400).json({error: 'No such simulation'})
    }

    res.status(200).json(simulation)
}

//update simulation
const updateSimulation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Bad format of ID'})
    }

    const simulation = await Simulation.findOneAndUpdate({ _id : id}, {
        ...req.body
    })

    if (!simulation) {
        return res.status(400).json({error: 'No such simulation'})
    }

    res.status(200).json(simulation)
}


module.exports = {
    createSimulation,
    getSimulations,
    getSimulation,
    deleteSimulation,
    updateSimulation
}