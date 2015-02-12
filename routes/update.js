var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PageStats = mongoose.model('PageStats')

router.get('/', function(req, res, next) {
  PageStats.updateStats('red-badger.com', function(err) {
    if (err) return console.error(err)
    res.render('index', { meta: {}, data: {} });
  })
});

module.exports = router;
