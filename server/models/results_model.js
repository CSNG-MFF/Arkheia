const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ResultSchema = new Schema({
  code_name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  parameters: {
    type: Schema.Types.Mixed,
    required: true
  }, 
  caption: {
    type: String,
    required: true
  },
  figure: {
    data: Buffer, // Store image data as Buffer
    contentType: String // Content type of the GIF
  }
}, { timestamps: true })

module.exports = mongoose.model('Results', ResultSchema);