var express = require('express');
var router = express.Router();

function checkOrInit(session) {
  if (session['init'] === true)
    return;
  session['init'] = true;
  session['lang'] = 'fr';
  session['logged'] =  false;
}

/* GET home page. */
router.get(['/', '/index'], function (req, res) {
  checkOrInit(req.session);
  if (req.session['logged'] === true)
    res.render('index', { account: req.session['account'] });
  else
    res.render('auths');
});

router.get('/logout', function (req, res) {
  req.session = null;
  res.render('auths');
})

/*router.get('/userinfo', function (req, res) {
  res.json( { firstName: req.session.account.firstName,
              lastName: req.session.account.lastName });
});*/

router.get('/template/:name', function (req, res) {
  var name = req.params.name;
  res.render('template/' + name);
});

module.exports = router;
