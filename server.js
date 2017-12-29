//Packages
var express = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var chalk = require('chalk');
//file includes
var config = require('./config/config');
// var autoIncrement = require('mongoose-auto-increment');
/************************* START App initialization ************************************/
/****************************************************************************************************/
var app = express();
var db;

//Parse json
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('temp'));
app.use(express.static(__dirname + '/public'));


//Set headers for Cross origin
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
//app.use('/api/*', require('./middlewares/validateRequest'));

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    res.status(404).json({status:"Page not found"}).end();
    
});

//Start server
app.set('port', config.port);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


/************************* END App initialization & Middlewares ************************************/
/***************************************************************************************************/

