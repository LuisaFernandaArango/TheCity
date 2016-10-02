// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'jett.ionic.filter.bar'])
.value("datosdesesion", {})
.value("datosdelugar", {"lugar":"latitude"})
.run(function($ionicPlatform, datosdesesion, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  if( window.localStorage.starter_google_user !== undefined){
   datosdesesion.user=JSON.parse( window.localStorage.starter_google_user );  
   $location.path('/lugar');

   // console.log(datosdesesion, "Runnnnn");
  }

})


       

.config(function($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider ) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('registro', {
      url: '/registro',
      cache:false,
     templateUrl: 'templates/registro.html',
    controller: 'Welcome'       
      
    })
  .state('login', {
      url: '/login',
      cache:false,
     templateUrl: 'templates/login.html',
      controller: 'Welcome'
        
      
    })
  .state('lectorQR', {
      url: '/lectorQR',
      cache:false,     
      templateUrl: 'templates/lectorQR.html',
      controller: 'lectorQRCtrl'        
      
    })
   .state('gustos', {
      url: '/gustos',
      cache:false,
     templateUrl: 'templates/gustos.html',
      controller: 'gustosCtrl'
        
      
    })
   .state('configuracion', {
      url: '/configuracion',
      cache:false,
     templateUrl: 'templates/configuracion.html',
      controller: 'HomeCtrl'       
      
    })
   .state('verDetalle', {
      url: '/verDetalle',
      cache:false,
     templateUrl: 'templates/verDetalle.html',      
     controller: 'MapaCtrl'
      
    })
   .state('icono', {
      url: '/icono',
      cache:false,
     templateUrl: 'templates/icono.html',
    controller: 'IconoCtrl'       
      
    })
   

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    cache:false,
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })       
    .state('tab.lugar', {
      url: '/lugar',
      cache:false,
      views: {
        'tab-lugar': {
          templateUrl: 'templates/lugar.html',
         controller: 'LugaresCtl'
        }
      }
    })  
    .state('tab.sitioCerca', {
        url: '/sitioCerca',
        cache:false,
        views: {
          'tab-sitioCerca': {
            templateUrl: 'templates/sitioCerca.html',
            controller: 'SitioCercaCtrl'
          }
        }
      })          
    .state('tab.perfil', {
        url: '/perfil',
        cache:false,
        views: {
          'tab-perfil': {
            templateUrl: 'templates/perfil.html',
            controller: 'DatosUserCtl'
          }
        }
      });

  // if none of the above states are matched, use this as the fallback
 
 
     $urlRouterProvider.otherwise('login');
  
  
  $ionicFilterBarConfigProvider.clear('ion-ios-close-empty');
});
