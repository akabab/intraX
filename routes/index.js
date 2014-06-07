var express = require('express');
var router = express.Router();

router.get(['/', '/index'], function (req, res) {
  res.render('index', { account: req.session['account'] });
});

router.get('/template/:name', function (req, res) {
  var name = req.params.name;
  res.render('template/' + name, { account: req.session['account'] });
});

router.get('/logout', function (req, res) {
  req.session['logged'] = false;
  res.redirect('/');
});

module.exports = router;
