'use strict';

module.exports = function (app) {
  // Root routing
    var core = require('../controllers/core.server.controller');

    var MongoClient = require('mongodb').MongoClient;

    var db;

    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/411", function(err, database) {
      if(err) { 
      	console.log("12345fsgfsfshfsff")
      	return console.dir(err); 
      }else{
      	console.log("connected");
      }

      //database.createCollection('users', function(err, collection) {});

      //database.createCollection('teams', function(err, collection) {});

      db = database;

    });

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/get-data/:city').get(core.getData);

  //app.route('/import-cal').get(core.importCal);

//User
  
  app.route('/create-user').post(function(req, res) {
      var user_data = req.body;
      db.collection('users').insert(user_data);
      res.json(user_data);
  });

  app.route('/login').post(function(req, res) {
      var user_data = req.body;
      db.collection('users').findOne({Email: user_data.username}, function (err, res2) {
          if(err){
              
          }else{
              console.log("user responce", res2);
              
              if(res2.Password == user_data.password){
                  res.json(res2);
              }
              
          }
      });
      
  });
  
  app.route('/admin-login').post(function(req, res) {
      var user_data = req.body;
      db.collection('teams').findOne({Admin_Email: user_data.username}, function (err, res2) {
          if(err){
              
          }else{
              console.log("admin responce", res2);
              
              if(res2.Admin_Password == user_data.password){
                  res.json(res2);
              }
              
          }
      });
     
  });


// Teams
  
  app.route('/vote').post(function(req, res) {
      var obj = req.body;
      console.log("vote obj", obj);
      db.collection('teams').update({Team_ID: obj.id}, {$set: {"Available_Times_Objs": obj.data}}, function (err, res) {
          
          db.collection('teams').findOne({Team_ID: obj.id}, function (err, res2) {
              if(err){
                  
              }else{
                  console.log("vote responce", res2);
                  
                  res.json(res2);
                  
              }
          });
          
      });
  });
  
  app.route('/create-team').post(function(req, res) {
      var team_data = req.body;
      console.log("TEAMMMMMMMMMMM DATAAAAAAAAAAAAAAAAAAAAAA", team_data);
      db.collection('teams').insert(team_data);
      res.json(team_data);
  });

  // Define application route
  app.route('/*').get(core.renderIndex);



};
