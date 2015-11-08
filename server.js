'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var influx = require('influx');

var Config = require('./config.json');

// influx
var client = influx(Object.assign({}, Config.influx));

// bodyParser for post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/printer/status')
    .get(function(req, res) {
      var query = 'select last(value) from "status" order asc';
      client.query(query, function (err, results) {
        if (err)
          res.send(err);
        res.json([{'status':results[0].points[0][1]}]);
      });
    });

// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
