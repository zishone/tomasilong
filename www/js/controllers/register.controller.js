angular.module('tomasilong.controllers')

.controller('RegisterCtrl', function($scope, $state, AuthService) {
  $scope.registerData = {};

  $scope.doRegister = function() {
    console.log('Doing register', $scope.registerData);

    if ($scope.registerData.email && $scope.registerData.password && $scope.registerData.username && $scope.registerData.phone && $scope.registerData.gender && $scope.registerData.payong) {
      if ($scope.registerData.password === $scope.registerData.confirmPassword) {
        $scope.showLoading('Signing Up...');

        $scope.registerData.payong = $scope.registerData.payong === "Yes"? true : false;

        AuthService.register($scope.registerData).then(function(response) {
          alert(response);

          $scope.hideLoading();

          $state.go('login').then(function() {
            $scope.clearHistory();
          });
        }, function(error) {
          alert(error);
          $scope.hideLoading();
        });
      }else {
        alert("Error: Passwords did not match.");
      }
    } else {
      alert("Error: No input.");
    }
  };
});
