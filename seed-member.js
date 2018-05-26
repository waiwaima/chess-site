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
mongoose.connect(mongodb, { useMongoClient: true, autoIndex: false })
const db = mongoose.connection
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

const Member = require('./src/server/models/member')

let filepath = path.join(__dirname, 'data', 'members.csv')
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
          if (isActivePlayer(json)) {
            let name = parseName(json.MEM_NAME)
            Member.findOneAndUpdate({ uscfId: json.MEM_ID },
              { $set: {
                uscfId: json.MEM_ID,
                firstName: name.firstName,
                lastName: name.lastName,
                fullName: json.MEM_NAME,
                expirationDate: json.EXPIRED,
                state: json.STATE,
                rating: json.R_LPB_RAT
              }},
              { new: true, upsert: true },
              (err, doc) => {
                if (err) {
                  // console.log('Failed to write this member to DB')
                  // console.log(json.MEM_ID)
                } else {
                  count++
                  console.log(count)
                }
                // continue next record no matter whether this record is updated or not
                resolve({success: true})
              })
          } else {
            // console.log('This an inactive player')
            // console.log(json.MEM_ID)
            // continue next record
            resolve({success: true})
          }
        })
      }, (err) => {
        callback(err)
      }, () => {
        // complete all rows
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
  if (json.EXPIRED === '12/31/99') return (!!json.R_LPB_RAT)
  let refDate = moment('1/1/16', 'M/D/YY')
  let expireDate = moment(json.EXPIRED, 'M/D/YY')
  active = (expireDate.diff(refDate, 'days', true)) > 0
  return active
}

function parseName (fullname) {
  let names = fullname.split(',')
  let lastName = names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase()
  let firstName = ''
  if (names.length > 1) {
    let pieces = names[1].split(' ')
    for (let i = 0; i < pieces.length; i++) {
      pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].slice(1).toLowerCase()
    }
    firstName = pieces.join(' ')
  }
  return {firstName: firstName, lastName: lastName}
}
