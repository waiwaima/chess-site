const async = require('async')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {google} = require('googleapis')
const cheerio = require('cheerio')

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(__dirname, 'data', 'credentials.json')
const SECRET_PATH = path.join(__dirname, 'data', 'client_secret.json')

// Load client secrets from a local file.
fs.readFile(SECRET_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
  // Authorize a client with credentials, then call the Google Sheets API.
  // authorize(JSON.parse(content), listLabels)
  authorize(JSON.parse(content), parsePlayerId)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth})
  gmail.users.labels.list({
    userId: 'me',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err)
    const labels = data.labels
    if (labels.length) {
      console.log('Labels:')
      labels.forEach((label) => {
        console.log(`- ${label.name}`)
      })
    } else {
      console.log('No labels found.')
    }
  })
}

/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getRecentEmail(auth) {
  const gmail = google.gmail({version: 'v1', auth})
  // Only get the recent email - 'maxResults' parameter
  gmail.users.messages.list({auth: auth, userId: 'me', maxResults: 1,}, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }

    // Get the message id which we will need to retreive tha actual message next.
    var message_id = response['data']['messages'][0]['id']

    // Retreive the actual message using the message id
    gmail.users.messages.get({auth: auth, userId: 'me', 'id': message_id}, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err)
        return
      }

      console.log(response['data'])
      for (let i = 0; i < response.data.payload.headers.length; i++) {
        console.log(response.data.payload.headers[i].name + ": " + response.data.payload.headers[i].value)
      }

      let raw
      if (response.data.payload.body.size > 0) {
        raw = response.data.payload.body.data
      } else {
        raw = response.data.payload.parts[0].body.data
      }
      let buff = new Buffer(raw, 'base64')
      let text = buff.toString()
      console.log(text)
    })
  })
}

function parsePlayerId(auth) {
  const gmail = google.gmail({version: 'v1', auth})
  let messageIds = []
  async.series([
    (callback) => {
      gmail.users.messages.list({auth: auth, userId: 'me', maxResults: 6}, (err, response) => {
        if (err) return callback(err)
        // Get the message id which we will need to retreive tha actual message next.
        console.log(response.data.messages.length)
        for (let i = 0; i < response.data.messages.length; i++) {
          messageIds.push(response.data.messages[i]['id'])
        }
        callback()
      })
    },
    (callback) => {
      async.forEach(messageIds, (messageId, cb1) => {
        async.series([
          (cb2) => {
            // Retreive the actual message using the message id
            gmail.users.messages.get({auth: auth, userId: 'me', 'id': messageId}, (err, response) => {
              if (err) return cb2(err)
              let fromPaypal = false
              for (let i = 0; i < response.data.payload.headers.length; i++) {
                if (response.data.payload.headers[i].name === 'From') {
                  console.log(response.data.payload.headers[i].name + ": " + response.data.payload.headers[i].value)
                }
                if (response.data.payload.headers[i].name === 'From'
                    && response.data.payload.headers[i].value.indexOf('service@paypal.com') > -1) {
                  console.log(response.data.payload.headers[i].name + ": " + response.data.payload.headers[i].value)
                  fromPaypal = true
                  break
                }
              }

              if (!fromPaypal) return cb2()
              if (response.data.payload.body.size === 0) return cb2()

              let raw = response.data.payload.body.data
              let buff = new Buffer(raw, 'base64')
              let text = buff.toString()
              // console.log(text)
              const $ = cheerio.load(text)
              let elems = $('span:contains("0701")')
              console.log(elems.length)
              let ids = []
              for (let i = 0; i < elems.length; i++) {
                let elem = elems.eq(i)
                if ($(elem).find('span').length === 0) {
                  let player = $(elem).next().text()
                  let uscfId = player.split(':')[0].trim()
                  console.log(uscfId)
                  ids.push(uscfId)
                }
              }
              cb2(null, ids)
            })
          }
        ], (err, rst2) => {
          if (err) return cb1(err)
          cb1()
        })
      }, (err, rst1) => {
        if (err) return callback(err)
        callback()
      })
    }
  ], (err, data) => {
    if (err) {
      console.log('The API returned an error: ' + err)
    } else {
      // console.log(data[1])
    }
  })
}
