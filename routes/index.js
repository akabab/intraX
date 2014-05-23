var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res) {
  res.render('index', { title: 'My index' });
});

router.get('/template/:name', function(req, res) {
  console.log("hey");
  var name = req.params.name;
  res.render('template/' + name);
});

router.get('*', function(req, res) {
   res.render('index', { title: 'My index redirected' });
});

module.exports = router;
