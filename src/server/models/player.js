const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  uscfId: Number,
  firstName: String,
  lastName: String,
  state: String,
  rating: Number,
  email: String,
  phone: Number,
  byes: [Number]
})
schema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

module.exports = mongoose.model('Member', schema)
