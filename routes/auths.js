var express = require('express');
var router = express.Router();

/* GET auths page. */
router.get('/', function(req, res) {
  res.render('auths', { title: 'authentification' });
});

module.exports = router;
