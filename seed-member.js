// update the database with USCF members
const async = require('async')
const mongoose = require('mongoose')
const path = require('path')
const csv = require('csvtojson')

// Get command line arguments
const args = process.argv.slice(2)
if (!args[0].startsWith('mongodb://')) {
  console.log('Run command: node seed-member mongodb://localhost/chess')
  return
}

console.log('This script populates default USCF member data.')
const mongodb = args[0]
mongoose.Promise = require('bluebird')
mongoose.connect(mongodb, {useMongoClient: true})
const db = mongoose.connection
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

const Member = require('./src/server/models/member')

let filepath = path.join(__dirname, 'data', 'test.csv')
console.log(filepath)
let csvStr = '1,2,3\n4,5,6'
console.log(csvStr)
let count = 0

/*
csv({noheader:true, output: 'csv'})
.fromString(csvStr)
.then((csvRow) => {
  console.log('reading data')
  console.log(csvRow)
})
*/

execute()

function execute () {
  async.series([
    (callback) => {
      console.log('calling csvtojson')
      csv()
      .fromFile(filepath)
      .on('csv', (csvRow) => {
        console.log('reading data...')
        // console.log(JSON.stringify(jsonObj))
        console.log(csvRow)
        count++
      })
      .on('done', (error) => {
        console.log('done')
        if (error) return callback(error)
        callback()
      })
    }
  ], (err, data) => {
    if (err) {
      console.log('ERROR: failed to update members')
      console.log(err)
    } else {
      console.log(`SUCCESS: completed updating ${count} members`)
    }
    mongoose.connection.close()
  })
}
*/
