const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  uscfId: String,
  firstName: String,
  lastName: String,
  fullName: String,
  rating: Number,
  expirationDate: String,
  state: String,
  email: String,
  phone: Number
})
schema.index({ uscfId: 1, fullName: 1 })
schema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

module.exports = mongoose.model('Member', schema)
