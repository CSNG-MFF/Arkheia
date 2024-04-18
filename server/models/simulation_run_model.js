const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SimulationRunSchema = new Schema({
  from_parameter_search: {
    type: Boolean,
    required: true
  },
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
  },
  model_description: {
    type: String,
    required: true
  },
  parameters: {
    type: Schema.Types.Mixed,
    required: true
  },
  stimuli: [{ type: Schema.Types.ObjectId, ref: 'Stimuli' }],
  exp_protocols: [{ type: Schema.Types.ObjectId, ref: 'ExpProtocols'}],
  records: [{ type: Schema.Types.ObjectId, ref: 'Records'}],
  results: [{ type: Schema.Types.ObjectId, ref: 'Results'}]

}, { timestamps: true });

module.exports = mongoose.model('Simulations', SimulationRunSchema);
