const mongoose = require('mongoose')

const Schema = mongoose.Schema

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
  simulations: [{ type: Schema.Types.ObjectId, ref: 'Simulations'}]
  //adding the pngs for individual runs, needs specification
}, { timestamps: true });

module.exports = mongoose.model('ParameterSearches', ParameterSearchSchema);
