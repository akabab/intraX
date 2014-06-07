var express = require('express');
var router = express.Router();

var userCategory = require('./modules/category');
var userTopic = require('./modules/topic');
var userMessage = require('./modules/message');

router.get('/category', userCategory.get);
router.post('/category', userCategory.post);
router.get('/topic', userTopic.get);
router.post('/topic', userTopic.post);
router.get('/message', userMessage.get);
router.post('/message', userMessage.post);
router.get('/category/:action', userCategory.get);
router.post('/category/:action', userCategory.post);
router.get('/topic/:id', userTopic.get);
router.post('/topic/:action', userTopic.post);
router.get('/message/:action', userMessage.get);
router.post('/message/:action', userMessage.post);

module.exports = router;
