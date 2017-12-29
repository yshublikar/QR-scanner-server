var express = require('express');
var router = express.Router();
var scanner = require('./controllers/scanner.js');

var multer = require('multer');
var upload = multer({ dest: 'temp/' })

router.post('/upload', upload.any(), scanner.upload);

module.exports = router;