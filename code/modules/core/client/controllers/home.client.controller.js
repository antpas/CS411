(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($scope, $http) {
   
    $scope.current_user = {};
$scope.cur_view = 'Home';
$scope.selected_vote = "";
$scope.current_team = {};

$scope.search_box = "Boston";
$scope.showVoteBtn = true;

function hrToInt(str){
    return parseFloat(str.replace(":", "."))
}

$scope.importTimesFromGC = function(){
    var busy_times = makeApiCall();
    busy_times.then(function(data){

        angular.forEach(data, function(value, key){

            var formatted_key = key.slice(0, 3);

            if($scope.current_user.Busy_Times[formatted_key]){
                $scope.current_user.Busy_Times[formatted_key] = $scope.current_user.Busy_Times[formatted_key].concat(value);
            }

        });

        var obj = {
            id: $scope.current_user.User_ID,
            data: $scope.current_user.Busy_Times
        };

    $http.post("/import-gc", obj).success(function(responce) {

        //returns whole team object back
        $scope.current_user = responce;

        console.log('import successfully');

      })


    });

};


$scope.getWeather = function (time){


    if($scope.weather_arr.length != 0){

        //console.log("Time", time);

        var vote_arr = time.split(" ");

        //console.log("vote_arr", vote_arr);

        if(!vote_arr[3]){
            return ""
        }

        var vote_day = vote_arr[0];
        var start = hrToInt(vote_arr[1]);
        var end = hrToInt(vote_arr[3]);

        for(var i = 0; i < $scope.weather_arr.length; i++){

            var split_arr = $scope.weather_arr[i].dt_txt.split(" ");

            var weekdays = new Array(7);
            weekdays[0] = "Sunday";
            weekdays[1] = "Monday";
            weekdays[2] = "Tuesday";
            weekdays[3] = "Wednesday";
            weekdays[4] = "Thursday";
            weekdays[5] = "Friday";
            weekdays[6] = "Saturday";

            var current_date = new Date(split_arr[0]);

            var day = weekdays[current_date.getDay()].slice(0,3);
            var hour = hrToInt(split_arr[1]);

            if(vote_day == day){

                if((start <= hour) && (end >= hour)){
                    return $scope.weather_arr[i].weather[0]["description"];
                }else if(i == $scope.weather_arr.length-1){
                    return $scope.weather_arr[i].weather[0]["description"];
                }else if(start >= hour){
                    return $scope.weather_arr[i].weather[0]["description"];
                }

            }

        }

    }

    return "";

};


function htmlToElement(html) {
    var doc = document.implementation.createHTMLDocument("example");
    doc.documentElement.innerHTML = html;
    return doc;
}

function generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
}

function getTimes(){

    console.log($scope.page_source.length);

    var doc = htmlToElement($scope.page_source);

    var table_rows = doc.getElementsByTagName('tbody')[4].children;

    var data = {
        "Mon":[],
        "Tue":[],
        "Wed":[],
        "Thu":[],
        "Fri":[]
    };

    for(var i = 1; i < table_rows.length; i++){

        if(table_rows[i].children[9].innerText == ''){// top semester
            break;
        }

        var days;

        if(i == 1){

            days = table_rows[i].children[10].innerText.split(",");

            for(var z = 0; z < days.length; z++){

                data[days[z]].push(table_rows[i].children[11].innerText.trim());
                data[days[z]].push(table_rows[i].children[12].innerText.trim());

            }

        }else{

            days = table_rows[i].children[9].innerText.split(",");

            var break_index = 0;
            var is_break = false;

            for(var x = 0; x < days.length; x++){
                if(days[x].length > 3){
                    var arr_vals = [];
                    var temp_str = "";
                    var counter = 0;
                    for(var n = 0; n < days[x].length; n++){

                        if(counter != 3 && n != days[x].length-1){
                            temp_str += days[x][n];
                            counter++;
                        }else if(n == days[x].length-1){
                            temp_str += days[x][n];
                            arr_vals.push(temp_str);
                        }else{
                            counter = 0;
                            arr_vals.push(temp_str);
                            temp_str = "";
                        }

                    }
                    is_break = true;
                    break_index = x;
                    days.splice(x, 1);
                    days = days.concat(arr_vals);
                    break;
                }
            }

            var arr_times_start = [];
            var arr_times_end = [];

            if(table_rows[i].children[10].innerText.length > 7){
                var temp_start = "";
                var temp_end = "";
                for(var p = 0; p < table_rows[i].children[10].innerText.length; p++){

                    if(p != 0){
                        if(table_rows[i].children[10].innerText[p-1] == 'm' || p == table_rows[i].children[10].innerText.length - 1){
                            arr_times_start.push(temp_start.trim());
                            arr_times_end.push(temp_end.trim());
                            temp_start = "";
                            temp_end = "";
                            continue;
                        }
                    }

                    temp_start += table_rows[i].children[10].innerText[p];
                    temp_end += table_rows[i].children[11].innerText[p];


                }
            }

            for(var k = 0; k < days.length; k++){

                if(is_break && k > break_index){

                    data[days[k]].push(arr_times_start[k-break_index]);
                    data[days[k]].push(arr_times_end[k-break_index]);

                }else if(is_break){

                    data[days[k]].push(arr_times_start[0]);
                    data[days[k]].push(arr_times_end[0]);

                }else{
                    data[days[k]].push(table_rows[i].children[10].innerText.trim());
                    data[days[k]].push(table_rows[i].children[11].innerText.trim());
                }

            }

        }

    }

    console.log(data);

    return data;

}

$scope.weather_arr = [];

$scope.search_box = "";

$scope.userSubmit = function () {

    var teams = [];

    if($scope.team_id.length > 0){
        teams.push($scope.team_id);
    }

    var data = {
        "Name": $scope.name,
        "User_ID": generateUUID(),
        "Email": $scope.email,
        "Password": $scope.password,
        "Teams": teams,
        "Busy_Times": getTimes()
    };

      $http.post("/create-user", data).success(function(data, status) {
        console.log('Data posted successfully');
      });

      $scope.cur_view = 'Home';

};

$scope.getFreeTimes = function () {


    $http.post("/free-times", {Team_ID: $scope.current_team.Team_ID, min: 8, max: 14}).success(function(responce) {

        //returns whole team object back
        console.log("responce", responce);

        $scope.current_team = responce;

        $scope.cur_view = 'Voting'

        console.log('got free times');
      })

};

$scope.login = function(){

    var login_data = {
        username: $scope.login_username,
        password: $scope.login_password
    };

    $http.post('/login', login_data).success(function(response){

        console.log("got the user data", response);

        $scope.current_user = response;

        $scope.cur_view = 'User';

    });

};

$scope.adminLogin = function(){

    var login_data = {
        username: $scope.admin_login_username,
        password: $scope.admin_login_password
    };

    $http.post('/admin-login', login_data).success(function(response){

        console.log("got the user data", response);

        $scope.current_team = response;

        $scope.cur_view = 'Admin_Manage';

    });

};

$scope.getVotingTimes = function(){

    var login_data = {
        Team_ID: $scope.current_user.Teams[0],
    };

    $http.post('/get-voting-times', login_data).success(function(response){

        console.log("got voting data", response);

        $scope.current_team = response;

        $scope.cur_view = 'Voting';

    });

};

$scope.submitVote = function () {

    console.log($scope.votingForm.vote_radio.$modelValue);

    for(var i = 0; i < $scope.current_team.Available_Times_Objs.length; i++){

        if($scope.current_team.Available_Times_Objs[i].Time_ID == $scope.votingForm.vote_radio.$modelValue){
            $scope.current_team.Available_Times_Objs[i].Total_Votes += 1;
            $scope.current_team.Available_Times_Objs[i].Voters.push("User_ID");//$scope.current_user.User_ID
        }

    }


    // post request to update object in team collection
    // updates object and returns whole team object back

    var obj = {
        id: $scope.current_team.Team_ID,
        data: $scope.current_team.Available_Times_Objs
    };

    $http.post("/vote", obj).success(function(responce) {

        //returns whole team object back
        $scope.current_team = responce;

        console.log('Data posted successfully');
      })

};

$scope.createTeam = function () {

    var team_obj = {
        "Team_Name": $scope.c_team_name,
        "Team_ID": generateUUID(),
        "Emails": $scope.c_team_emails.replace(/\s/g, '').split(','),
        "Constraints":{
            "Meeting_Length": 60,
            "Min_Time": 8,
            "Max_Time":10
          },
        "Admin_Email": $scope.c_admin_email,
        "Admin_Password": $scope.c_admin_password,
        "Available_Times_Objs": []
    };

    console.log("team obj", team_obj);

    $http.post("/create-team", team_obj).success(function(responce) {

        //returns whole team object back
        $scope.current_team = responce;

        $scope.cur_view = 'Admin_Manage';

        console.log('Create team posted successfully');

      })

};

$scope.getData = function(){
    $scope.weather_arr = [];

    console.log("sending req");

    var s = '/get-data/Boston';

    $http.get(s).success(function(response){

        response = JSON.parse(response);

        console.log("got the data", response);

        for(var i = 0; i < response.list.length; i++){

            var d = new Date(response.list[i].dt_txt);
            var h = d.getHours();
            //response.list[i].dt_txt = d.toDateString() + ' ' + h + ":00";
            $scope.weather_arr.push(response.list[i]);
            
        }
    });

};

$scope.getData();

    }
    }());
