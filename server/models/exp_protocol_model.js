const mongoose = require('mongoose')

const Schema = mongoose.Schema

// The schema for the experimental protocols
const ExpProtocolSchema = new Schema({
  code_name: {
    type: String,
    required: true
  },
  short_description: {
    type: String,
    required: true
  },
  long_description: {
    type: String,
    required: true
  },
  parameters: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('ExpProtocol', ExpProtocolSchema);