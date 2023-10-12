const mongoose = require('mongoose')

const Schema = mongoose.Schema

const simulationsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Simulations', simulationsSchema)
