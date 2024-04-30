const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Thes shcema for the records
const RecordsSchema = new Schema({
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
  variables: {
    type: Schema.Types.Mixed,
    required: true
  },
  source: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Records', RecordsSchema);