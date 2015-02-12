var express = require('express')
var util = require('util')
var router = express.Router()
var mongoose = require('mongoose')
var PageStats = mongoose.model('PageStats')

router.get('/', function(req, res, next) {
  PageStats.find(function(err, data) {
    if (err) return console.error(err)

    var dates = []

    data.forEach(function(item) {
      dates.push(item.meta.added)
    })

    var meta = {
      url: data[0] ? data[0].url : "",
      dates: dates,
      pageTitle: data[0] ? data[0].pageTitle : ""
    }

    var keys = Object.keys(data[0].stats.toObject())
    var sample = data.shift(), accumulator = {}

    keys.forEach(function(key) {
      var val = sample.stats[key];
      accumulator[key] = [val]
    })

    var result = data.reduce(function(accumulator, current) {
      keys.forEach(function(key) {
        accumulator[key].push(current.stats[key])
      })

      return accumulator
    }, accumulator)

    res.render('index', { data: result, meta: meta })
  })
})

module.exports = router
