// update the database with USCF members
const async = require('async')
const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')

// Get command line arguments
const args = process.argv.slice(2)
if (!args[0].startsWith('mongodb://')) {
  console.log('Run command: node scrape-next-rating mongodb://localhost/chess')
  return
}

console.log('This script update USCF member rating.')
const mongodb = args[0]
mongoose.Promise = require('bluebird')
mongoose.connect(mongodb, { useMongoClient: true, autoIndex: false })
const db = mongoose.connection
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

const Player = require('./src/server/models/player')
let count = 0
let players = []
let pages = []
let queueSize = 10

execute()

function execute () {
  async.series([
    (callback) => {
      Player.find({},
        (err, docs) => {
          if (err) return callback(err)
          console.log(`There are total ${ docs.length } players`)
          players = docs
          callback()
        })
    },
    (callback) => {
      let queue = async.queue(scrape, queueSize)
      queue.drain = function () {
        console.log('All the work in queue has been done')
        callback()
      }
      for (let i = 0; i < players.length; i++) {
        queue.push({ uscfId: players[i].uscfId })
      }
    }
  ], (err, data) => {
    if (err) {
      console.log('ERROR: failed to update members')
    } else {
      console.log(`SUCCESS: completed updating ${ count } members`)
    }
    mongoose.connection.close()
  })
}

function scrapingWorker (task, callback) {
  axios.get(`http://www.uschess.org/msa/MbrDtlMain.php?${ task.uscfId }`)
    .then(response => {
      pages.push(response.data)
      callback(null, pages)
    })
    .catch(err => {
      console.log(`Failed to fetch webpage for ${ task.uscfId }`)
      callback(err)
    })
}

function scrape (task, cb) {
  let rating
  let id = task.uscfId
  async.series([
    (callback) => {
      // scrape uschess.org
      axios.get(`http://www.uschess.org/msa/MbrDtlMain.php?${ id }`)
        .then(response => {
          let $ = cheerio.load(response.data)
          let elem = $('td:contains("Regular Rating")').eq(-1)
          let nextRatingStr = $(elem).next().next().text()
          console.log(`next month's rating: ${ nextRatingStr }`)
          if (nextRatingStr && nextRatingStr.trim()) {
            rating = nextRatingStr.trim()
          } else {
            // parse rating
            let ratingHtml = $(elem).next().find('nobr').eq(0).html().trim()
            // console.log(ratingHtml)
            ratingPart = ratingHtml.split('&')[0]
            let rsts = ratingPart.match(/\d{3,4}/)
            if (rsts && rsts.length > 0) {
              rating = rsts[0].trim()
            }
          }
          callback(null, { rating: rating })
        })
        .catch(err => {
          // console.log(err)
          console.log(`Failed to parse rating for ${ id }`)
          callback(err)
        })
    },
    (callback) => {
      // update database
      if (rating === undefined) return callback({ status: 'ERROR'})
      Player.findOneAndUpdate({ uscfId: id },
        { $set: { rating: rating }},
        { new: true, upsert: true },
        (err, doc) => {
          if (err) return callback(err)
          callback()
        })
    }
  ], (err, data) => {
    if (err) {
      console.log(`Status: not update ${ id }`)
    } else {
      count++
      console.log(count)
    }
    cb()
  })
}
