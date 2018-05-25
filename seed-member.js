// update the database with USCF members
const async = require('async')
const mongoose = require('mongoose')
const path = require('path')
const csv = require('csvtojson')
const moment = require('moment')

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

let filepath = path.join(__dirname, 'data', 'players.csv')
let count = 0
let succeeded = true
let activePlayers = []

execute()

function execute () {
  async.series([
    (callback) => {
      console.log('calling csvtojson')
      csv()
      .fromFile(filepath)
      .subscribe((json) => {
        return new Promise((resolve, reject) => {
          console.log('reading data...')
          console.log(JSON.stringify(json))
          if (isActivePlayer(json)) {
            activePlayers.push(json)
            count++
          } else {
            console.log('an inactive player???')
          }
          resolve({success: true})
          // succeeded = false
          // reject({success: false})
        })
      }, (err) => {
        callback(err)
      }, () => {
        if (succeeded) callback()
      })
    }
  ], (err, data) => {
    if (err) {
      console.log('ERROR: failed to update members')
      console.log(err)
    } else {
      console.log(`SUCCESS: completed updating ${count} members`)
      for (let i = 0; i < activePlayers.length; i++) {
        console.log(JSON.stringify(activePlayers[i]))
      }
    }
    mongoose.connection.close()
  })
}

function isActivePlayer (json) {
  let active = true
  // inactive member
  if (json.MEM_NAME === 'INACTIVE ID') return false
  // life member
  if (json.EXPIRED === '12/31/99') return true
  let refDate = moment('1/1/13', 'M/D/YY')
  let expireDate = moment(json.EXPIRED, 'M/D/YY')
  active = (expireDate.diff(refDate, 'days', true)) > 0
  return active
}
