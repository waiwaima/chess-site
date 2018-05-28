const async = require('async')
const express = require('express')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const Player = require('../models/Player')
const Member = require('../models/Member')

module.exports = function () {
  const router = express.Router()
  router.post('/wallchart', function (req, res) {
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    // Rename it to its orignal name when uploaded successfully
    form.on('file', function (field, file) {
      let index = file.name.lastIndexOf('.')
      let suffix = file.name.slice(index)
      let name = 'wallchart' + suffix.toLowerCase()
      let filepath = path.join(form.uploadDir, name)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      fs.renameSync(file.path, filepath)
    })
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err)
      res.status(500).send({message: 'Failed to upload wallchart file'})
    })
    // Send a response to the client once all the files have been uploaded
    form.on('end', function () {
      res.json({status: 'SUCCESS'})
    })
    // Parse the incoming request containing the form data
    form.parse(req)
  })

  router.delete('/wallchart', function (req, res) {
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filenames = ['wallchart.html', 'wallchart.xls']
    for (let i = 0; i < filenames.length; i++) {
      let filepath = path.join(uploadDir, filenames[i])
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }
    res.json({status: 'SUCCESS'})
  })

  router.get('/wallchart', function (req, res) {
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filepath = path.join(uploadDir, 'wallchart.html')
    let rst = {}
    if (fs.existsSync(filepath)) {
      fs.readFile(filepath, 'utf8', function (err, data) {
        const $ = cheerio.load('' + data + '')
        $('BODY > div').each(function (i, elem) {
          const title = $(elem).find('h3').text()
          if (title.indexOf('Master') > -1) {
            rst.master = $.html($(elem).find('table'))
          } else if (title.indexOf('U2000') > -1) {
            rst.u2000 = $.html($(elem).find('table'))
          } else if (title.indexOf('U1600') > -1) {
            rst.u1600 = $.html($(elem).find('table'))
          }
        })
        res.json(rst)
      })
    } else {
      res.json(rst)
    }
  })

  router.post('/standings', function (req, res) {
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    // Rename it to its orignal name when uploaded successfully
    form.on('file', function (field, file) {
      let index = file.name.lastIndexOf('.')
      let suffix = file.name.slice(index)
      let name = 'standings' + suffix.toLowerCase()
      let filepath = path.join(form.uploadDir, name)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      fs.renameSync(file.path, filepath)
    })
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err)
      res.status(500).send({message: 'Failed to upload standings file'})
    })
    // Send a response to the client once all the files have been uploaded
    form.on('end', function () {
      res.json({status: 'SUCCESS'})
    })
    // Parse the incoming request containing the form data
    form.parse(req)
  })

  router.delete('/standings', function (req, res) {
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filenames = ['standings.html', 'standings.xls']
    for (let i = 0; i < filenames.length; i++) {
      let filepath = path.join(uploadDir, filenames[i])
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }
    res.json({status: 'SUCCESS'})
  })

  router.get('/standings', function (req, res) {
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filepath = path.join(uploadDir, 'standings.html')
    let rst = {}
    if (fs.existsSync(filepath)) {
      fs.readFile(filepath, 'utf8', function (err, data) {
        const $ = cheerio.load('' + data + '')
        $('BODY > div').each(function (i, elem) {
          const title = $(elem).find('h3').text()
          if (title.indexOf('Master') > -1) {
            rst.master = $.html($(elem).find('table'))
          } else if (title.indexOf('U2000') > -1) {
            rst.u2000 = $.html($(elem).find('table'))
          } else if (title.indexOf('U1600') > -1) {
            rst.u1600 = $.html($(elem).find('table'))
          }
        })
        res.json(rst)
      })
    } else {
      res.json(rst)
    }
  })

  router.get('/standings/:tournament', function (req, res) {
    let tournament = req.params.tournament
    let filename = 'standings-' + tournament + '.html'
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filepath = path.join(uploadDir, filename)
    let rst = {}
    if (fs.existsSync(filepath)) {
      fs.readFile(filepath, 'utf8', function (err, data) {
        const $ = cheerio.load('' + data + '')
        rst.standing = $.html($('BODY'))
        res.json(rst)
      })
    } else {
      res.json(rst)
    }
  })

  router.post('/pairings/:section', function (req, res) {
    let section = req.params.section
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    // Rename it to its orignal name when uploaded successfully
    form.on('file', function (field, file) {
      let index = file.name.lastIndexOf('.')
      let suffix = file.name.slice(index)
      let name = 'pairings-' + section + suffix.toLowerCase()
      let filepath = path.join(form.uploadDir, name)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      fs.renameSync(file.path, filepath)
    })
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err)
      res.status(500).send({message: `Failed to upload the ${section} section's pairing file`})
    })
    // Send a response to the client once all the files have been uploaded
    form.on('end', function () {
      res.json({status: 'SUCCESS'})
    })
    // Parse the incoming request containing the form data
    form.parse(req)
  })

  router.delete('/pairings/:section', function (req, res) {
    let section = req.params.section
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filenames = [`pairings-${section}.html`, `pairings-${section}.xls`]
    for (let i = 0; i < filenames.length; i++) {
      let filepath = path.join(uploadDir, filenames[i])
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }
    res.json({status: 'SUCCESS'})
  })

  router.get('/pairings/:section', function (req, res) {
    let section = req.params.section
    let uploadDir = path.join(__dirname, '..', '..', '..', 'static')
    let filepath = path.join(uploadDir, `pairings-${section}.html`)
    let rst = {}
    if (fs.existsSync(filepath)) {
      fs.readFile(filepath, 'utf8', function (err, data) {
        const $ = cheerio.load('' + data + '')
        $('BODY > div').each(function (i, elem) {
          const title = $(elem).find('h3').text()
          const str = title.match(/round \d/gi)
          if (str && str.length) {
            rst.round = str[0].match(/\d/)[0]
          }
          rst[section] = $.html($(elem).find('table'))
        })
        res.json(rst)
      })
    } else {
      res.json(rst)
    }
  })

  router.get('/players', (req, res) => {
    Player.find({}, (err, docs) => {
      if (err) {
        res.status(500).send({message: `Failed to list tournament players`})
      } else {
        res.json(docs)
      }
    })
  })

  router.post('/players', (req, res) => {
    let existingMember
    async.series([
      (callback) => {
        Member.find({ uscfId: req.body.uscfId },
          (err, doc) => {
            if (err) return callback(err)
            existingMember = doc
            callback(null, doc)
          })
      },
      (callback) => {
        if (existingMember) {
          Member.findByIdAndUpdate(existingMember.id,
            { $set: {
              email: req.body.email,
              phone: req.body.phone
            }},
            { new: true},
            (err, doc) => {
              if (err) return callback(err)
              callback(doc)
            })
        } else {
          let member = new Member({
            uscfId: req.body.uscfId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fullName: req.body.lastName.toUpperCase() + ',' + req.body.firstName.toUpperCase(),
            rating: req.body.rating,
            state: req.body.state,
            email: req.body.email,
            phone: req.body.phone
          })
          member.save((err, doc) => {
            if (err) return callback(err)
            callback(doc)
          })
        }
      },
      (callback) => {
        let player = {
          uscfId: req.body.uscfId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          rating: req.body.rating,
          state: req.body.state,
          email: req.body.email,
          phone: req.body.phone,
          tournament: req.body.tournament,
          section: req.body.section,
          byes: req.body.byes
        }
        Player.findOneAndUpdate({ uscfId: req.body.uscfId },
          { $set: player },
          { new: true, upsert: true },
          (err, doc) => {
            if (err) return callback(err)
            callback(doc)
          })
      }
    ], (err, docs) => {
      if (err) {
        res.status(500).send({message: `Failed to add player ${ req.body.firstName } ${ req.body.lastName }`})
      } else {
        res.json(docs[2])
      }
    })
  })

  return router
}
