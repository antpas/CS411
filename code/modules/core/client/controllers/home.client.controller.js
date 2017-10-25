(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($scope, $http) {
    var vm = this;

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