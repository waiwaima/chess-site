const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  uscfId: String,
  firstName: String,
  lastName: String,
  rating: Number,
  state: String,
  email: String,
  phone: Number,
  tournament: String,
  section: String,
  byes: [String]
})
schema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

module.exports = mongoose.model('Player', schema)
