var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var modules = require('./modules/mod');

router.get('/', modules.get);
router.get('/:module', modules.get);
router.post('/:action', bodyParser(), modules.post);

module.exports = router;
