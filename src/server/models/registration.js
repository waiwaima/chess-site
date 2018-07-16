const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  uscfId: String,
  firstName: String,
  lastName: String,
  rating: Number,
  title: String,
  state: String,
  email: String,
  phone: Number,
  tournament: String,
  section: String,
  sectionText: String,
  byes: [String],
  payment: Number,
  timestamp: String
})
schema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

module.exports = mongoose.model('Registration', schema)
