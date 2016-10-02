angular.module('starter.services', [])


.service('servicioSails', function($http, UserService) {

  var servicioSails = {};

  this.add = function(ruta, datos, successFunction){
    var url = 'http://192.168.0.23:1337/' + ruta;
    $http({
      method: 'POST',
      url: url,
      data: angular.toJson(datos, true)
    }).then(function successcallback(response) {
      console.log(response.data);
        if(ruta=="user" && window.localStorage.starter_google_user != undefined){
          var user=JSON.parse( window.localStorage.starter_google_user );
          user.id=response.data.id;
          UserService.setUser(user);          
        }
        if (successFunction != undefined) {
          successFunction();
        };      
    });
   }

   this.consulta = function(ruta, datos, successFunction){
    var url = 'http://192.168.0.23:1337/' + ruta;
    $http({
      method: 'POST',
      url: url,
      data: angular.toJson(datos, true)
    }).then(function successcallback(response) {
        if (successFunction != undefined) {
            successFunction(response.data);
        };      
    });
   }

   this.get =function(ruta, successFunction){
    var url = 'http://192.168.0.23:1337/' + ruta;
    $http({
      method: 'GET',
      url: url
    }).then(function successcallback(response) {
     
        if (successFunction != undefined) {
          successFunction(response.data);
        };
    });
   }
   this.postRespuesta = function(ruta, successFunction){
    var url = 'http://192.168.0.23:1337/' + ruta;
    $http({
      method: 'POST',
      url: url
    }).then(function successcallback(response) {
      console.log(response.data);      
        if (successFunction != undefined) {
          successFunction();
        };      
    });
   }
 })
.service('UserService', function(datosdesesion) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

  var setUser = function(user_data) {
    datosdesesion.user = user_data;
    window.localStorage.starter_google_user = JSON.stringify(user_data);

  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_google_user || '{}');
  };
  return {
    getUser: getUser,
    setUser: setUser
  };
});
