angular.module('tomasilong.controllers')

.controller('AppCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $ionicLoading, AuthService, UserService) {
  $scope.auth = AuthService.auth();
  $scope.userData = {};

  $scope.doLogout = function() {
    AuthService.logout().then(function() {
      $state.go('login').then(function() {
        $scope.clearHistory();
      });
    });
  };

  $scope.showLoading = function(template) {
    $ionicLoading.show({
      template: template
    });
  };

  $scope.hideLoading = function() {
    $ionicLoading.hide();
  };

  $scope.clearHistory = function() {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  };

  $scope.auth.onAuthStateChanged(function(user) {
    if (user) {
      UserService.get_user_data().then(function(userData) {
        $scope.userData = userData;
        $state.go('tab.map').then(function() {
          $scope.clearHistory();
        });
      });
    } else {
      $state.go('login').then(function() {
        $scope.clearHistory();
      });
    }
  });

  $scope.changePayongStatus = function() {
    UserService.change_payong_status($scope.userData.payong);
  };

  $scope.showPopup = function(title, text) {
    $ionicPopup.show({
      template: text,
      title: title,
      scope: $scope,
      buttons: [
      { text: 'No' },
      {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function(e) {

        }
      }
    ]
    });
  };

});
