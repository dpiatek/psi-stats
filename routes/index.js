var express = require('express')
var util = require('util')
var url = require('url')
var router = express.Router()
var mongoose = require('mongoose')
var PageStats = mongoose.model('PageStats')
var configUrl = process.env["PSI_STATS_URL"]

router.get('/', function(req, res, next) {
  var params = getParams(req.url)

  var daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - params.daysAgo)

  var q = PageStats.find({ 'meta.url': new RegExp(configUrl, 'i') }).where("meta.added").gt(daysAgo).limit(params.limit)
  q.exec(function(err, data) {
    if (err) return console.error(err)

    var meta = getMeta(data, configUrl)
    var result = getResult(data)

    res.render('index', { data: result, meta: meta })
  })
})

function getParams(requestUrl) {
  var params = (url.parse(requestUrl, true)).query

  return {
    limit: parseLimitParam(params.limit),
    daysAgo: parseDayParam(params.daysAgo)
  }
}

function parseDayParam(val) {
  var n = parseInt(val)
  return isNaN(n) || n < 1 || n > 356 ? 14 : n;
}

function parseLimitParam(val) {
  var n = parseInt(val)
  return isNaN(n) || n < 1 || n > 1000 ? 100 : n;
}

function getMeta(data, url) {
  var dates = []

  data.forEach(function(item) {
    dates.push(item.meta.added)
  })

  return {
    url: url,
    dates: dates
  }
}


function getResult(data) {
  if (!data[0]) return []

  var keys = Object.keys(PageStats.schema.tree.stats)
  var sample = data.shift(), accumulator = {}

  keys.forEach(function(key) {
    var val = sample.stats[key];
    accumulator[key] = [val]
  })

  return data.reduce(function(accumulator, current) {
    keys.forEach(function(key) {
      accumulator[key].push(current.stats[key])
    })

    return accumulator
  }, accumulator)
}


module.exports = router
