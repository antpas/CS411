'use strict';
const request = require('request');
const axios = require('axios');
const https = require('https');

// var clientId = '1047116930477-ih7sksdovml1ikvh6p36bns1usa0hcki.apps.googleusercontent.com';
// var apiKey = '9WvhN3o7H-QRjc7J_ZclAFqn';
// var scopes = 'https://www.googleapis.com/auth/calendar';


var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {

  res.status(500).render('modules/core/server/views/500', {
    error: 'fff! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.getData = function (req, res) {

    //res.send("test");

    console.log("got GET request");

    var city = req.params.city;

    https.get('https://api.openweathermap.org/data/2.5/forecast?q=' + city + ',US&appid=829f2c926714e2cc6f6f1241c9003641', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
           data += chunk;
      });

       // The whole response has been received. Print out the result.
       resp.on('end', () => {
         res.json(data);
      });

      }).on("error", (err) => {
          console.log("Error: " + err.message);
      });
};

exports.importCal = function(req,res){



};

exports.authGoogle = function(req,resp) {

  console.log("Got GET from Google");
  https.get('https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000&response_type=code&client_id=1047116930477-ih7sksdovml1ikvh6p36bns1usa0hcki.apps.googleusercontent.com', (resp) => {
    let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
});

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    res.json(data);
});

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
};



