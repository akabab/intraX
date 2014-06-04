var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/index'], function (req, res) {
  if (req.session && req.session['logged'])
    res.render('index', { account: req.session['account'] });
  else
    res.redirect('auths');
});

router.get('/template/:name', function (req, res) {
  var name = req.params.name;
  res.render('template/' + name);
});

router.get('/logout', function (req, res) {
  // req.session.destroy();
  req.session['logged'] = false;
  // client.unbind();
  res.redirect('/');
});

module.exports = router;
