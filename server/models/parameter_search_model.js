const mongoose = require('mongoose')

const Schema = mongoose.Schema

// The schema for the parameter searches
const ParameterSearchSchema = new Schema({  
  run_date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  model_name: {
    type: String,
    required: true
  },
  simulations: [{ type: Schema.Types.ObjectId, ref: 'Simulations'}],
  parameter_combinations: {
    type: Object
  }
}, { timestamps: true });

module.exports = mongoose.model('ParameterSearch', ParameterSearchSchema);
