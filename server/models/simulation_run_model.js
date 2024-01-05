const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SimulationRunSchema = new Schema({
  simulation_run_name: {
    type: String,
    required: true
  },
  model_name: {
    type: String,
    required: true
  },
  creation_data: {
    type: Date,
    required: true
  }
}, { timestamps: true });


module.exports = mongoose.model('simulation_runs_collection', SimulationRunSchema);