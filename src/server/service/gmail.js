const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {google} = require('googleapis')
const cheerio = require('cheerio')

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(__dirname, '..', '..', '..', 'data', 'credentials.json')
const SECRET_PATH = path.join(__dirname, '..', '..', '..', 'data', 'credentials.json')

const TOTAL_QUERY = 180
let queryCount = 0
let monitor = null
let pendingRegistrations = []
let readMessageIds = []

function fetchPaymentEmail() {
  // Load client secrets from a local file.
  fs.readFile(SECRET_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    // authorize(JSON.parse(content), listLabels)
    authorize(JSON.parse(content), parsePlayerId)
  })
}

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
  // Only get the recent email - 'maxResults' parameter
  gmail.users.messages.list({auth: auth, userId: 'me', maxResults: 1,}, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }

    // Get the message id which we will need to retreive tha actual message next.
    var message_id = response.data.messages[0]['id']

    // Retreive the actual message using the message id
    gmail.users.messages.get({auth: auth, userId: 'me', 'id': message_id}, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err)
        return
      }

      // console.log(response['data'])
      let fromPaypal = false
      for (let i = 0; i < response.data.payload.headers.length; i++) {
        if (response.data.payload.headers[i].name === 'Subject'
            && response.data.payload.headers[i].value === 'Notification of payment received') {
          console.log(response.data.payload.headers[i].name + ": " + response.data.payload.headers[i].value)
          fromPaypal = true
          break
        }
      }

      if (!fromPaypal) {
        return
      }

      if (response.data.payload.body.size === 0) {
        return
      }

      let raw = response.data.payload.body.data
      let buff = new Buffer(raw, 'base64')
      let text = buff.toString()
      // console.log(text)
      const $ = cheerio.load(text)
      let elem = $('span:contains("0701")').eq(-1)
      console.log($(elem).html())
      let player = $(elem).next().text()
      console.log(player.split(':')[0])
    })
  })
}

function checkPayment(uscfId) {
  pendingRegistrations.push(uscfId)
  queryCount = 0
  if (!monitor) {
    monitor = setInterval(fetchPaymentEmail, 5000)
  }
}

module.exports = {
  checkPayment
}