const mongoose = require('mongoose')
const chalk = require('chalk')

module.exports = function () {
  let db

  // mongoose.Promise = global.Promise
  mongoose.Promise = require('bluebird')

  if (mongoose.connection.readyState !== 1) {
    console.log('Connecting to Mongo...')
    let options = {
      user: '',
      pass: '',
      server: {
        socketOptions: {keepAlive: 1}
      }
    }
    db = mongoose.connect('mongodb://localhost:27017/chess', options, function afterConnection (err) {
      if (err) {
        console.log(chalk.red.bold('Could not connect to MongoDB'))
        return
      }

      let isDevMode = false
      mongoose.set('debug', isDevMode)
    })

    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

    mongoose.connection.once('open', function afterOpen () {
      console.log(chalk.green.bold('Mongo DB connected'))
    })
  } else {
    console.log(chalk.green.bold('Mongo DB already connected'))
    db = mongoose
  }

  return db
}
