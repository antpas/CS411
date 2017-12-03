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
  
  
  
  
  function am_pm_to_hours(time) {
				var temp = time.slice(time.length-2, time.length)
        time = time.slice(0,time.length-2)
        time = time + " " + temp;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "pm" && hours < 12) hours = hours + 12;
        if (AMPM == "am" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours +':'+sMinutes);
    }

    function isBusy(start, end, time){

    	start = hrToInt(start);
      end = hrToInt(end);
      time = hrToInt(time);

      return (time >= start) && (time <= end);

    }

    function hrToInt(str){
    	return parseFloat(str.replace(":", "."))
    }

    function makeNumbersRange(min, max){

			var min_d = new Date();
   	 	min_d.setHours(min);
      var max_d = new Date();
   	 	max_d.setHours(max);



      var diffMs = (max_d - min_d); // milliseconds



      var diffMins = Math.round(diffMs / 60000); // minutes



    	var arr = [];
      var minute = 0;
      var hour = Math.floor(min);

      for(var i = 0; i < diffMins; i++){

      	if(minute == 60){
        	minute = 0
          hour++
        }

        var val;

        if(minute < 10){
        	val = hour + ":0" + minute;
        }else{
        	val = hour + ":" + minute;
        }



        arr.push(val);

        minute++;


      }

      return arr;

}

    function getPotentialTimes(obj, times){

    	var potential_times = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
      };


      var delta = 5;

    	for(key in obj){

      	var streak_counter = 0;


      	for(var b = 0; b < obj[key].length; b++){



        	if(obj[key][b] == 1){

          	if(b == times.length-1){

            	if(streak_counter >= delta){
                potential_times[key].push([times[b-streak_counter], times[b]])
              }

            }

          	streak_counter++;

          }else if(obj[key][b] == 0 || b == times.length-1){



          	if(streak_counter >= delta){
            	potential_times[key].push([times[b-streak_counter], times[b]])
            }

          	streak_counter = 0;

          }

        }

      }

      return potential_times;

    }


    function merge_times(min, max, main_arr){
        
  //      var main_arr = [
  //
  //  {
  //    Monday: ["8:00am", "8:30am"],
  //    Tuesday: ["9:00am", "10:30am"],
  //    Wednesday: [],
  //    Thursday: [],
  //    Friday: []
  //  },
  //  {
  //    Monday: ["10:00am", "11:30am"],
  //    Tuesday: ["1:00pm", "2:30pm"],
  //    Wednesday: [],
  //    Thursday: [],
  //    Friday: []
  //  }
  //];
        
        var temp = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };

        for(var i = 0; i < main_arr.length; i++){
        
            for(var key2 in main_arr[i]){
    
            for(var z = 0; z < main_arr[i][key2].length; z++){
            main_arr[i][key2][z] = am_pm_to_hours(main_arr[i][key2][z])
          }
    
            temp[key2] = temp[key2].concat(main_arr[i][key2]);
    
        }
    
      }
        
        var all_times = makeNumbersRange(min, max);
        
        var final = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        };

        for(var key in temp){

  		    var bin_array = [];

          for(var t = 0; t < all_times.length; t++){
    
                for(var k = 0; k < temp[key].length; k+=2){
    
                  var a = temp[key][k];
                  var b = temp[key][k+1];
    
                  var busy = isBusy(a, b, all_times[t]);
    
                  if(busy){
                    bin_array.push(0);
                    break;
                  }else if(k == temp[key].length - 2){
                    bin_array.push(1);
                    break;
                  }
    
                }
    
          }
    
          final[key] = bin_array;
    
        }

        return getPotentialTimes(final, all_times);
        
        
    }
  
  
  
  

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
