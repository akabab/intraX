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
router.get('/', function(req, res) {
  checkOrInit(req.session);
  if (req.session['logged'] === true)
    res.render('index', { account: req.session['account'] });
  else
    res.render('index');
});


router.get('/template/:name', function(req, res) {
  var name = req.params.name;
  res.render('template/' + name);
});

module.exports = router;
