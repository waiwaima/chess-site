const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')

function initMiddleware (app) {
  // Request body parsing middleware should be above methodOverride
  // Express requires the bodyParser middleware to handle POST request
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(validator())
  app.use(bodyParser.json())
  app.use(methodOverride())
}

function initSession (app, db) {
  let sessionCookie = {
    // session expiration is set by default to one week
    // maxAge: 7 * 24 * (60 * 60 * 1000),

    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,

    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  }

  app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'chesscookiesecret',
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: 'sessions',
      autoReconnect: true
    }),
    cookie: sessionCookie,
    name: 'sessionId'
  }))

  app.use(flash())
}

function initAuth (app) {
  app.use(passport.initialize())
  app.use(passport.session())
  // configure passport
  passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, username, password, done) {
    console.log(`username: ${username}, password: ${password}`)
    if (username === 'admin' && password === "bechess211") {
      const user = {
        username: 'admin'
      }
      return done(null, user)
    } else {
      return done("Error", false, req.flash('message', 'Failed to sign in'))
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.username)
  })

  passport.deserializeUser((username, done) => {
    if (username === 'admin') {
      const user = {
        username: 'admin'
      }
      return done(null, user)
    } else {
      return done(null, false)
    }
  })

  var authRoutes = express.Router()
  authRoutes.post('/login',
    passport.authenticate('login', {
      failureRedirect: '/#/login',
      successRedirect: '/',
      failureFlash: true
    })
  )

  authRoutes.get('/logout', function (req, res) {
    req.logout()
    req.session.destroy()
    res.redirect('/')
  })

  authRoutes.get('/user', function (req, res) {
    if (req.user) {
      let user = JSON.parse(JSON.stringify(req.user))
      res.json(user)
    } else {
      res.json({})
    }
  })
  app.use('/auth', authRoutes)
}

function initRoute (app, db) {
  const chessRouter = require('../routes/chess')()
  app.use('/api', chessRouter)
}

module.exports = function () {
  const db = require('./mongo')()
  const app = express()

  initMiddleware(app)
  initSession(app, db)
  initAuth(app)
  initRoute(app, db)

  return app
}
