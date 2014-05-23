var express = require('express');
var router = express.Router();

/* GET auths page. */
router.get('/', function (req, res) {
  res.render('auths', { title: 'authentification' });
});

router.post('/', function (req, res) {
  if (!req.body.pwd || !req.body.login)
    res.send("empty variable");
  else {
    console.log(req.body.pwd, req.body.login);
    res.send("GOOD");
  }
});

module.exports = router;
