var express = require('express')
var path = require('path')
var logger = require('morgan')

var mongoose = require('mongoose')
var MONGO_URI = process.env["PSI_MONGO"] || 'mongodb://localhost/stats'
require(__dirname + '/models/page-stats')

var routes = require('./routes/index')
var update = require('./routes/update')

var options = { server: { socketOptions: { keepAlive: 1 } } }
mongoose.connect(MONGO_URI, options)
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/update', update)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
