var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var PageStats = mongoose.model('PageStats')
var url = process.env["PSI_STATS_URL"]

router.get('/', function(req, res, next) {
  PageStats.updateStats(url, function(err) {
    if (err) return console.error(err)
    res.render('update', { url: url })
  })
})

module.exports = router
