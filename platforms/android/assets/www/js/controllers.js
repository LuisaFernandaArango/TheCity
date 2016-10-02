angular.module('starter.controllers', ['ti-segmented-control'])

.controller('HomeCtrl', function($scope, UserService,$ionicHistory , $ionicActionSheet, $state, $ionicLoading, $ionicHistory) {
	$scope.user = UserService.getUser();

	$scope.showLogOutMenu = function() {
		console.log("Cerrar?");
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Esta seguro que desea cerrar sesión y acabar con la aventura',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
					template: 'Logging out...'
				});
				// Google logout
				window.plugins.googleplus.logout(
					function (msg) {
						console.log(msg); 
						$ionicLoading.hide();
						UserService.setUser({});
						console.log("Cerrar seccion con google");
						//$ionicHistory.removeBackView();
						//window.location.replace('/login');
						$state.go('login');
						
						
						
					},
					function(fail){
						console.log(fail);
					}
				);

				// Facebook logout
		       /** facebookConnectPlugin.logout(function(){
		          $ionicLoading.hide();
		          UserService.setUser({});
		          console.log("Cerrar seccion con facebook");
		           window.location.replace('/login');
		          $state.go('login');
				 
		          
		        	},
		        function(fail){
		          $ionicLoading.hide();
		        });*/
			}
		});
	};
	$scope.myGoBack = function() {
	    $ionicHistory.goBack();
	};
})

.controller('IconoCtrl', function($scope, servicioSails, datosdesesion, $state, $ionicHistory) {
	$scope.lista={};	
	$scope.data={
		  clientSide: 'https://t4.ftcdn.net/jpg/00/81/27/49/160_F_81274900_7NJFx78euPIaWD59IO9VY1KO261hs6bp.jpg'
	};
	var getIconos =  function(data){
		$scope.lista=data;
		console.log($scope.lista);
	};
	servicioSails.get('icono', getIconos);

	$scope.iconoPerfil = function (){

		servicioSails.postRespuesta("user/update/"+datosdesesion.user.id+"?picture="+$scope.data.clientSide);
		$state.go('tab.lugar');

	}
	$scope.myGoBack = function() {
	    $ionicHistory.goBack();
	};

})
.controller('LugaresCtl', function($scope, servicioSails, $state, datosdelugar, datosdesesion, $ionicFilterBar ) {

	$scope.listaLugares={};
	var iduser={"id": datosdesesion.user.id};
	
	var getLugares =  function(data){
		$scope.listaLugares=data;
		console.log($scope.listaLugares);
		datoslugaresuser=$scope.listaLugares;
		
	};
	var getEventos =  function(data){
		$scope.listaLugares=data;
		console.log($scope.listaLugares);
	};

	$scope.buttonClicked = function(index){
      console.log(index);
      if (index===0) {
      	servicioSails.consulta('User/metodo', iduser, getLugares);      
      	 $scope.$apply();
      }
      if (index===1)
       {

      	servicioSails.consulta('User/eventodeuser', iduser, getEventos);      
      	 $scope.$apply();
      }
    }
	//Barra de busqueda
	$scope.showFilterBar = function () {
    var filterBarInstance = $ionicFilterBar.show({
      cancelText: "<i class='ion-ios-close-outline'></i>",
      items: $scope.listaLugares,
      update: function (filteredItems, filterText) {
        $scope.listaLugares = filteredItems;
      }
    });
  };	
	$scope.verDetalle = function(lugar){
				
		datosdelugar.lugar=lugar;
		$state.go('verDetalle');
	};
	servicioSails.consulta('User/metodo', iduser, getLugares);  
})


.controller('DatosUserCtl', function($scope, datosdesesion, servicioSails) { 
 	$scope.nombre =datosdesesion.user.nombre;
	$scope.usuario={};
 	var getUsuario =  function(data){
		$scope.usuario=data; 
		console.log(datosdesesion.user.correo);		
	};
	servicioSails.get("user?correo="+datosdesesion.user.correo , getUsuario);

})
.controller('lectorQRCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup, servicioSails, datosdesesion, $ionicHistory) { 
	
	var puntos;
 	$scope.lista={};
 	$scope.usuario={};
	var getPromociones =  function(data){
		$scope.lista=data;
		console.log($scope.lista);
	};
	servicioSails.get('promocion', getPromociones);

	var getUsuario =  function(data){
		$scope.usuario=data;
		puntos= $scope.usuario.teenpoint +5;
		console.log(puntos +"   puntos");
		servicioSails.postRespuesta("user/update/"+datosdesesion.user.id+"?teenpoint="+puntos);
		
	};

	$scope.leerCodigo = function(){
		var bandera = false;
	 	$cordovaBarcodeScanner.scan().then( function(imgEscaneada){
	 		// An alert dialog
			$scope.showAlert = function(titulo, subtitle, validar) {
			   var alertPopup = $ionicPopup.alert({
			     title: titulo,
			     template: subtitle
			   });

			   alertPopup.then(function(res) {
			     console.log('Promocion');
			   });
			};
			for (var i = 0; i < $scope.lista.length; i++) {
				console.log($scope.lista[i].nombre);
				if (imgEscaneada.text==$scope.lista[i].nombre) {
		 			bandera=true;		 			
					 $scope.showAlert("En hora buena!", "Acabas de obtener un promoción","SI");
		 			if (imgEscaneada.text=="puntos") {
		 				//Se le da la promocion a al usuario
		 				console.log((i+1) + "  valor de i");
		 				servicioSails.postRespuesta("user/"+datosdesesion.user.id+"/promocion/"+(i+1));
		 				//Obtenemos todos los datos del usuarios (Todos los datos no estan en localstorange)
		 				servicioSails.get("user?id="+datosdesesion.user.id , getUsuario);
		 				
		 				
		 				
		 				console.log("hecho"); 
		 			}
		 		}
				
			}
			if(bandera==false){
				bandera++;
				$scope.showAlert("Lo sentimos!", "Este codigo no es valido","NO");

			}
	 		
	 	}, function(error){
	 		alert("Ha ocurrido un error : "+ error);
	 	});
	 }
	 $scope.myGoBack = function() {
	    $ionicHistory.goBack();
	};


})
.controller('gustosCtrl', function($scope, UserService, $state,servicioSails, datosdesesion, $ionicHistory) { 

	$scope.lista={};
	$scope.milista={};

	var getGustos =  function(data){
		$scope.lista=data;
	};
	$scope.gustosdeuser = function(){
		for (key in $scope.milista) {
			$scope.milista[key]
			console.log(datosdesesion.user.id);
			servicioSails.postRespuesta("user/"+datosdesesion.user.id+"/gustos/"+key);
  			$state.go('tab.lugar');
		}
	};

	$scope.addgusto = function(gusto){

		if (gusto.added == true) {
			delete $scope.milista[gusto.id];
			gusto.added = false;
		}
		else{    
			gusto.added = true;
			$scope.milista[gusto.id]=gusto;

		}
		console.log($scope.milista);
	};
	$scope.myGoBack = function() {
    	$ionicHistory.goBack();
  	};
	servicioSails.get('gustos', getGustos);

})

.controller('Welcome', function($scope, $state,$ionicHistory, $ionicPopup,$ionicLoading,$q, $ionicLoading, servicioSails, UserService) {

	$scope.usuarioEmail={};
	$scope.usuarioPass={};
	$scope.user={};
	//Logear
	$scope.logear =  function(){		
		servicioSails.get('user?correo='+$scope.user.correo, getUserEmail);		
	}

	var getUserEmail =  function(data){
		$scope.usuarioEmail=data;	
		servicioSails.get('user?pass='+$scope.user.pass, getUserPass);
		
	};
	var getUserPass =  function(data){		
		$scope.usuarioPass=data;	
		try {
   			 var idEmail = $scope.usuarioEmail[0].id;
   			 var idPass = $scope.usuarioPass[0].id;

   			 if(idEmail==idPass){
				console.log("Bienvenido");
				var userLocal ={};
				userLocal.correo=$scope.user.correo;
				userLocal.id=$scope.usuarioEmail[0].id;
				userLocal.picture=$scope.usuarioEmail[0].picture;
				userLocal.nombre=$scope.usuarioEmail[0].nombre;
				userLocal.teenpoint=$scope.usuarioEmail[0].teenpoint;
				UserService.setUser(userLocal);
				console.log(userLocal); 
				$state.go('tab.lugar'); 
			}
				
			
		}
		catch(err) {
		   // An alert dialog
				$scope.showAlert = function(titulo, subtitle, validar) {
				   var alertPopup = $ionicPopup.alert({
				     title: titulo,
				     template: subtitle
				   });

				   alertPopup.then(function(res) {
				     console.log('ERROR');
				   });
				}
				   $scope.showAlert("Lo sentimos", "El usuario no fue encontrado, intentalo nuevamente","ERROR AUTENTICACION");
		}
	
		
	};
	//Registro
	$scope.registro =  function(){
		servicioSails.add('user', $scope.user);
		UserService.setUser($scope.user);
		$state.go('gustos'); 
	}
  //IniciarSecion 
   $scope.iniciar = function () {
  	$state.go('login'); 
  }

  //Registrar
   $scope.Resgitro = function () {
  	$state.go('registro'); 
  }
  
    //google
  // This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function() {

  	$scope.validar={};
  	var existe=false;
  	var user={};
  	var userData = {};

  	var getValidacion =  function(data){
			$scope.validar=data;
			if ($scope.validar.length>=1)
			{	
				existe = true;
				user.userId = userData.userId;
				user.accessToken = userData.accessToken;
				user.idToken = userData.idToken;
				user.id=data[0].id;
				UserService.setUser(user);
				console.log(userData);	
				$ionicLoading.hide();			
				//$ionicHistory.removeBackView();
				//window.location.replace('/gustos');
				$state.go('tab.lugar');
			}else{
				servicioSails.add('user', user);
				user.userId = userData.userId;
				user.accessToken = userData.accessToken;
				user.idToken = userData.idToken;
				console.log(user);
				UserService.setUser(user);
				$ionicLoading.hide();	
				$state.go('gustos');

			}
		}
  	console.log("ingreso");
  	$ionicLoading.show({
  		template: 'Logging in...'
  	});

  	window.plugins.googleplus.login(
  		{},
  		function (user_data) {
		// For the purpose of this example I will store user data on local storage
		userData=user_data;
		 user= {
			nombre: user_data.displayName,
			correo: user_data.email,
			picture: user_data.imageUrl,
			provider: "google"
		};
		servicioSails.get('user?correo='+user.correo, getValidacion);

		
		
	},
	function (msg) {
		$ionicLoading.hide();
	}
	);
  };




//Facebook

  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
  	if (!response.authResponse){
  		fbLoginError("Cannot find the authResponse");
  		return;
  	}

  	var authResponse = response.authResponse;

  	getFacebookProfileInfo(authResponse)
  	.then(function(profileInfo) {
	  // For the purpose of this example I will store user data on local storage
	  var user= {
	  	nombre: profileInfo.name,
	  	correo: profileInfo.email,
	  	picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large",
	  	provider: "facebook"
	  };
	  servicioSails.add('user', user);
	  user.userId = profileInfo.id;  
	  user.authResponse= authResponse; 
	  UserService.setUser(user);
	  console.log(profileInfo);
	  $ionicLoading.hide();
	  $state.go('gustos');
	}, function(fail){
	  // Fail get profile info
	  console.log('profile info fail', fail);
	});
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
  	console.log('fbLoginError', error);
  	$ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
  	var info = $q.defer();

  	facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
  		function (response) {
  			console.log(response);
  			info.resolve(response);
  		},
  		function (response) {
  			console.log(response);
  			info.reject(response);
  		}
  		);
  	return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
  	facebookConnectPlugin.getLoginStatus(function(success){
  		if(success.status === 'connected'){
		// The user is logged in and has authenticated your app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed request, and the time the access token
		// and signed request each expire
		console.log('getLoginStatus', success.status);

		// Check if we have our user saved
		var user = UserService.getUser('facebook');

		if(!user.userID){
			getFacebookProfileInfo(success.authResponse)
			.then(function(profileInfo) {
			// For the purpose of this example I will store user data on local storage
		 /*   UserService.setUser({
			  authResponse: success.authResponse,
			  userID: profileInfo.id,
			  name: profileInfo.name,
			  email: profileInfo.email,
			  picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
			}); */
			console.log(profileInfo);
			$state.go('gustos');
		}, function(fail){
			// Fail get profile info
			console.log('profile info fail', fail);
		});
		}else{
			$state.go('gustos');
		}
	} else {
		// If (success.status === 'not_authorized') the user is logged in to Facebook,
		// but has not authenticated your app
		// Else the person is not logged into Facebook,
		// so we're not sure if they are logged into this app or not.

		console.log('getLoginStatus', success.status);

		$ionicLoading.show({
			template: 'Logging in...'
		});

		// Ask the permissions you need. You can learn more about
		// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
		facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
	}
});

  };


})
.controller('SitioCercaCtrl', function($scope, $http, datosdesesion, servicioSails) {
	$scope.listaLugares={};
	var iduser={"id": datosdesesion.user.id};
    
    var lat1;
    var lon1;
    var cerca={};
     function toRad(Value) {
    	/** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}
	var getLugares =  function(data){
		$scope.listaLugares=data;
		for (var i = 0; i < $scope.listaLugares.length; i++) {
			var R = 6371; // km
			var dLat = toRad($scope.listaLugares[i].latitude-lat1);
			var dLon = toRad($scope.listaLugares[i].longitude-lon1);
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.cos(toRad(lat1)) * Math.cos(toRad($scope.listaLugares[i].latitude)) *
			        Math.sin(dLon/2) * Math.sin(dLon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c;
			if (d<=2) {
				console.log(d);
				cerca.longitude=$scope.listaLugares[i].longitude;
				cerca.latitude=$scope.listaLugares[i].latitude;
				console.log(cerca.longitude+"----------------");


			} 
			 var myPosicion = new google.maps.Marker(
				  {
				  	position: new google.maps.LatLng($scope.listaLugares[i].latitude, $scope.listaLugares[i].longitude),
				  	map: mapa
				  });


		}
		
		
	
	};
	var mapa = new google.maps.Map(
		document.getElementById("mapa"), 
		{ 
			center: new google.maps.LatLng(4.515170, -75.697943),
			zoom: 15, 
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
	
	
 	
	// intentamos obtener la posicion actual del dispositivo
	navigator.geolocation.getCurrentPosition(
		onSuccess_HighAccuracy,
		onError_HighAccuracy,
		{
			maximumAge:0,
			timeout:10000,
			enableHighAccuracy: true
		}
		);

	function onSuccess_HighAccuracy(pos) { // dispositivo con GPS
	  // centramos el mapa sobre la posicion devuelta por el dispositivo
	  servicioSails.consulta('User/metodo', iduser, getLugares); 
	  mapa.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
	  //creamos un marcador en esa posición
	  var myPosicion = new google.maps.Marker(
	  {
	  	position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
	  	map: mapa
	  });
	
	  	lon1=pos.coords.longitude;
		lat1=pos.coords.latitude;
	
	}

	function onError_HighAccuracy(error) {// dispositivo sin GPS
	  if (error.code == error.TIMEOUT){ // si no ha dado tiempo volvemos a intentarlo
	  	navigator.geolocation.getCurrentPosition(
	  		onSuccess_HighAccuracy,
		  onError_LowAccuracy, // si ha dado error desistimos
		  {
		  	maximumAge:0,
		  	timeout:10000,
		  	enableHighAccuracy: false
		  }
		  );
	  }
	  else{// mostramos una alerta con el error
	   // alert(JSON.stringify(error)); 
	}
}

	function onError_LowAccuracy(error) { // mostramos una alerta con el error
	  //alert(JSON.stringify(error)); 
	}
	$scope.mapa = mapa;
	 
  // añadimos el evento al mapa para iniciar el proceso
  google.maps.event.addDomListener(window, 'load');

})
.controller('MapaCtrl', function($scope, datosdelugar) {

//	function iniciarMapa() {
	
	console.log(datosdelugar.lugar.latitude, "Google dentro");
	$scope.lugar=datosdelugar.lugar;
	var mapa = new google.maps.Map(
		document.getElementById("mapa"), 
		{ 
			center: new google.maps.LatLng(datosdelugar.lugar.latitude,  datosdelugar.lugar.longitude),
			zoom: 18, 
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		var myPosicion = new google.maps.Marker(
	{
	  	position: new google.maps.LatLng(datosdelugar.lugar.latitude, datosdelugar.lugar.longitude),
	  	map: mapa,
	  	title: datosdelugar.lugar.nombre
	});
	
	
 	
	
	function onError_LowAccuracy(error) { // mostramos una alerta con el error
	  //alert(JSON.stringify(error)); 
	}
	$scope.mapa = mapa;

  // añadimos el evento al mapa para iniciar el proceso
  google.maps.event.addDomListener(window, 'load');

});

