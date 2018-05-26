const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  uscfId: Number,
  firstName: String,
  lastName: String,
  fullName: String,
  expirationDate: String,
  state: String,
  rating: Number,
  email: String,
  phone: Number
})
schema.index({ uscfId: 1, fullName: 1 })
schema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

module.exports = mongoose.model('Member', schema)
