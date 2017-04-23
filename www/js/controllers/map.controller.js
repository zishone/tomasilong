angular.module('tomasilong.controllers')

.controller('MapCtrl', function($scope, $ionicModal, $ionicPopup, MarkersService, UserService, FireService, BUILDINGS) {
  $scope.buildings = BUILDINGS.buildings;

  $scope.mapCreated = function(map) {
    $scope.map = map;

    var options = {
      enableHighAccuracy: true,
      timeout: 5000
    };

    navigator.geolocation.watchPosition(function(position) {
      $scope.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      UserService.set_location(position.coords.latitude, position.coords.longitude);

      // if (!$scope.userData.payong) {
      //   MarkersService.removeMarkers();
      //   MarkersService.addMarker($scope.map, $scope.position, "You");
      // }
    }, function (error) {}, options);


    FireService.ref_nagpapasilong().on('value', function(snapshot) {
      var mgaNagpapasilong = snapshot.val();
      MarkersService.removeMarkers();
      for (var nagpapasilong in mgaNagpapasilong) {
        var nagpapasilongPosition = new google.maps.LatLng(mgaNagpapasilong[nagpapasilong].location.lat, mgaNagpapasilong[nagpapasilong].location.lng);
        MarkersService.addMarker($scope.map, nagpapasilongPosition, mgaNagpapasilong[nagpapasilong].data.username, 'img/umbrella-pin.png');
      }
    });

    FireService.ref_makikisilong().on('value', function(snapshot) {
      var mgaMakikisilong = snapshot.val();
      for (var user in mgaMakikisilong) {
        if($scope.userData.payong){
          showMagpapasilongQuestion(user, mgaMakikisilong);
        }
      }
    });

    FireService.ref_link().on('value', function(snapshot) {
      if (($scope.userData.username !== null) && ($scope.userData.username !== undefined) && snapshot.hasChild($scope.userData.username)) {
        var mgaMakikisilong2 = snapshot.val();
				console.log(mgaMakikisilong2);
        $scope.waitingFor = mgaMakikisilong2[$scope.userData.username].nagpapasilong;
        $scope.closeModalMakikisilong();
        $scope.openModalWaiting();
				var link_status = mgaMakikisilong2[$scope.userData.username].status;
				if(link_status === "onway"){
					$scope.openModalOnway2();
				}else{
					$scope.closeModalOnway2();
				}
      }else{
        $scope.closeModalWaiting();
				$scope.closeModalOnway2();
      }
    });

    function showMagpapasilongQuestion(user, mgaMakikisilong) {
      $ionicPopup.show({
        template: 'You can locate ' + user + ' in ' + mgaMakikisilong[user].pickup + '.',
        title: 'Someone Needs Payong!',
        scope: $scope,
        buttons: [
          { text: 'No' },
          {
            text: '<b>Yes</b>',
            type: 'button-positive',
            onTap: function(e) {
              var data = {
                nagpapasilong: $scope.userData,
                makikisilong: mgaMakikisilong[user],
								status: 'looking'
              };
              UserService.create_link(user, data);
              $scope.lookingFor = mgaMakikisilong[user];
              $scope.openModalLooking();
            }
          }
        ]
      });
    }

		$scope.changeLinkStatus =  function() {
			console.log($scope.lookingFor.data.username);
			UserService.change_link_status($scope.lookingFor.data.username).then(function(){
				$scope.openModalOnway1();
			});
    };

		$scope.dropoff = function() {
			UserService.remove_link($scope.lookingFor.data.username).then(function() {
				$ionicPopup.show({
					template: 'Dropped Off!',
					title: 'Success!',
					scope: $scope,
					buttons: [
          	{ text: 'OK' }
					]
				});
			});
		};

    $ionicModal.fromTemplateUrl('makikisilong-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalMakikisilong = modal;
    });
    $scope.openModalMakikisilong = function() {
      $scope.modalMakikisilong.show();
    };
    $scope.closeModalMakikisilong = function() {
      $scope.modalMakikisilong.hide();
    };

    $ionicModal.fromTemplateUrl('looking.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLooking = modal;
    });
    $scope.openModalLooking = function() {
      $scope.modalLooking.show();
    };
    $scope.closeModalLooking = function() {
      $scope.modalLooking.hide();
    };

		$ionicModal.fromTemplateUrl('onway1.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalOnway1 = modal;
    });
    $scope.openModalOnway1 = function() {
      $scope.modalOnway1.show();
    };
    $scope.closeModalOnway1 = function() {
      $scope.modalOnway1.hide();
    };

		$ionicModal.fromTemplateUrl('onway2.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalOnway2 = modal;
    });
    $scope.openModalOnway2 = function() {
      $scope.modalOnway2.show();
    };
    $scope.closeModalOnway2 = function() {
      $scope.modalOnway2.hide();
    };

    $ionicModal.fromTemplateUrl('waiting.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalWaiting = modal;
    });
    $scope.openModalWaiting = function() {
      $scope.modalWaiting.show();
    };
    $scope.closeModalWaiting = function() {
      $scope.modalWaiting.hide();
    };

    $scope.removeLink = function() {
      if($scope.userData.payong){
        UserService.remove_link($scope.lookingFor.data.username).then(function() {
          $scope.closeModalLooking();
        });
      }else{
        UserService.remove_link($scope.userData.username).then(function() {
          $scope.closeModalWaiting();
        });
      }
    };


    $scope.removeFromMakikisilong = function() {
      UserService.remove_from_makikisilong();
    };

    $scope.addToMakikisilong = function(pickup, dropoff) {
      UserService.add_to_makikisilong(pickup, dropoff);
    };
  };
});
