var psi = require('psi')
var mongoose = require('mongoose')
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
  "numberCssResources": Number
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
  var self = this;

  psi(url, function(err, result) {
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

    self.create(item, cb)
  })
}

mongoose.model('PageStats', schema);
