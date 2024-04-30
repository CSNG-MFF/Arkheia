const mongoose = require('mongoose')

const Schema = mongoose.Schema

// The schema for the results
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
    fileId: mongoose.Types.ObjectId,
    contentType: String
}
}, { timestamps: true })

module.exports = mongoose.model('Results', ResultSchema);