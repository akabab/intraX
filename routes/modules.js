var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var modules = require('./modules/mod');
var activities = require('./modules/activities');

router.get('/', modules.get);
router.get('/:module', modules.get);
router.post('/:action', bodyParser(), modules.post);

router.get('/:module/:activity', activities.get);
router.post('/:module/:action', bodyParser(), activities.post);

module.exports = router;
