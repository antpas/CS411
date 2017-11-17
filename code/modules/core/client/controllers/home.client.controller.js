(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($scope, $http) {
    var vm = this;
    
    $scope.name = "";
    $scope.email = "";
    $scope.password = "";
    $scope.page_source = "";
    $scope.user_data = {};

    function htmlToElement(html) {
        var doc = document.implementation.createHTMLDocument("example");
        doc.documentElement.innerHTML = html;
        return doc;
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

    $scope.userSubmit = function userSubmit() {

        $scope.user_data = {
          "Name": $scope.name,
          "User_ID": 1,
          "Email": $scope.email,
          "Password": $scope.password,
          "Teams": [
            "Team_ID_1",
            "Team_ID_2"
          ],
          "Busy_Times": getTimes()
        };

    };

    $scope.searchBox = "";

    $scope.weather_arr = [];

    $scope.getData = function(){
        $scope.weather_arr = [];

        console.log("sending req");

        var s = '/get-data/' + $scope.searchBox;

        $http.get(s).success(function(response){


            response = JSON.parse(response);
                        console.log("got the data", response);

            for(var i = 0; i < response.list.length; i++){

                var d = new Date(response.list[i].dt_txt);
                var h = d.getHours();

                if(h > 8 && h < 19){
                    response.list[i].dt_txt = d.toDateString() + ' ' + h + ":00";
                    $scope.weather_arr.push(response.list[i]);
                }
            }
        });
    };
  }
}());
