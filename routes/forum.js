var express = require('express');
var router = express.Router();

var userCategory = require('./modules/category');
var userTopic = require('./modules/topic');
var userMessage = require('./modules/message');

router.get('/category', userCategory.get);
router.post('/category', userCategory.post);

router.get('/message/:topic/:message', userMessage.get);
router.get('/message/:topic/:subtopic/:message', userMessage.get);
router.post('/message/:action', userMessage.post);

router.get('/topic/:topic', userTopic.get);
router.get('/topic/:topic/:subtopic', userTopic.get);
router.post('/topic/:action', userTopic.post);
module.exports = router;
