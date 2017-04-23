angular.module('tomasilong.controllers')

.controller('LoginCtrl', function($scope, $state, AuthService) {
  $scope.loginData = {};

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    if ($scope.loginData.email && $scope.loginData.password) {
      $scope.showLoading('Signing In...');
      AuthService.login($scope.loginData.email, $scope.loginData.password).then(function() {
        $scope.hideLoading();

        $state.go('tab.map').then(function() {
          $scope.clearHistory();
        });
      }, function (error) {
        $scope.hideLoading();
        alert(error);
				$scope.hideLoading();
      });
    } else {
      alert("Please enter email and password both");
    }
  };
});
