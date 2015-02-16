var express = require('express')
var util = require('util')
var router = express.Router()
var mongoose = require('mongoose')
var PageStats = mongoose.model('PageStats')
var url = process.env["PSI_STATS_URL"]

router.get('/', function(req, res, next) {
  PageStats.find({ 'meta.url': new RegExp(url, 'i') }, function(err, data) {
    if (err) return console.error(err)

    var meta = getMeta(data, url)
    var result = getResult(data)

    res.render('index', { data: result, meta: meta })
  })
})


function getMeta(data, url) {
  var dates = []

  data.forEach(function(item) {
    dates.push(item.meta.added)
  })

  return {
    url: url,
    dates: (dates.length > 10 ? dates.slice(-10) : dates)
  }
}


function getResult(data) {
  if (!data[0]) return []

  var keys = Object.keys(data[0].stats.toObject())
  var sample = data.shift(), accumulator = {}

  keys.forEach(function(key) {
    var val = sample.stats[key];
    accumulator[key] = [val]
  })

  return (data.length > 10 ? data.slice(-10) : data).reduce(function(accumulator, current) {
    keys.forEach(function(key) {
      accumulator[key].push(current.stats[key])
    })

    return accumulator
  }, accumulator)
}


module.exports = router
