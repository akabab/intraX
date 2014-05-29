var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.render('template/user', user);
  res.end();
});

router.post('/:name', function (req, res) {
  
});

var user = {
  name: "John",
  lastname: "Doe",
  uid: "41244",
  city: "Paris",
  age: 12
};

module.exports = router;
