const mongoose = require('mongoose')

const Schema = mongoose.Schema

const StimuliSchema = new Schema({
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
  }, 
  movie: {
    data: Buffer, // Store GIF data as Buffer
    contentType: String // Content type of the GIF
  }
}, { timestamps: true })

module.exports = mongoose.model('stimuli_collection', StimuliSchema);