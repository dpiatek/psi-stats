var psi = require('psi')
var mongoose = require('mongoose')

var key = process.env["PSI_STATS_KEY"]
var locale = process.env["PSI_STATS_LOCALE"]
var strategy = process.env["PSI_STATS_STRATEGY"]

var STAT_TYPES = {
  "numberResources": Number,
  "numberHosts": Number,
  "totalRequestBytes": String,
  "numberStaticResources": Number,
  "htmlResponseBytes": String,
  "cssResponseBytes": String,
  "imageResponseBytes": String,
  "javascriptResponseBytes": String,
  "otherResponseBytes": String,
  "numberJsResources": Number,
  "numberCssResources": Number,
  "score": Number
}

var schema = mongoose.Schema({
  "meta": {
    "added": { type: Date, default: Date.now },
    "url": String,
    "pageTitle": String
  },
  "stats": STAT_TYPES
});

schema.statics.updateStats = function(url, cb) {
  var self = this
  var config = {
    locale: locale || "en_US",
    strategy: strategy || "mobile"
  }

  if (key) {
    config.key = key
  } else {
    config.nokey = true
  }

  psi(url, config, function(err, result) {
    if (err) return console.error(err)

    var item = {
      meta: {},
      stats: {}
    }

    item.meta.url = result.id;
    item.meta.pageTitle = result.title;

    Object.keys(STAT_TYPES).forEach(function(stat) {
      item.stats[stat] = result.pageStats[stat]
    })

    // Score is at top level
    item.stats.score = result.score;

    self.create(item, cb)
  })
}

mongoose.model('PageStats', schema);
