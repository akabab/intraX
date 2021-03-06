'use strict';

var express = require('express');
var router = express.Router();

router.get(['/', '/index'], function (req, res) {
  if (req.session && req.session['logged']) {
    res.render('index', { account: req.session['account'] });
  }
  else {
    res.redirect('auths');
  }
});

router.get('/template/:name', function (req, res) {
  var name = req.params.name;
  console.log(name);
  res.render('template/' + name, { account: req.session['account'] });
});


router.get('/logout', function (req, res) {
  req.session['logged'] = false;
  res.redirect('/');
});

module.exports = router;
