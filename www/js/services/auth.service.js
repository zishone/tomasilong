angular.module('tomasilong.services')

.factory("AuthService", function ($q, FireService){
  var auth = firebase.auth();

  function activate_user() {
    FireService.ref_users().child(auth.currentUser.uid).once('value').then(function(snapshot) {
      var userData = snapshot.val();

      if(userData.payong){
        FireService.ref_nagpapasilong().child(userData.username).set({
          data: userData
        });
      }
    });
  }

  function deactivate_user(uid) {
    FireService.ref_users().child(uid).once('value').then(function(snapshot) {
      var userData = snapshot.val();

      if(userData.payong){
        FireService.ref_nagpapasilong().child(userData.username).remove();
      }
    });
  }

  var login = function(email, password) {
    return $q(function(resolve, reject) {
      auth.signInWithEmailAndPassword(email, password).then(function successCallback(authData) {
        activate_user();
        resolve('Login Success.');
      }).catch(function (error) {
        reject("Authentication failed: " + error.message);
      });
    });
  };

  var logout = function() {
    return $q(function(resolve, reject) {
      var uid = auth.currentUser.uid;
      auth.signOut().then(function successCallback() {
        deactivate_user(uid);
        resolve('Logout Success.');
      }, function errorCallback(response) {
        reject('Logout Failed.');
      });
    });
  };

  var register = function (user) {
    return $q(function(resolve, reject) {
      auth.createUserWithEmailAndPassword(user.email, user.password).then(function (userData) {
        FireService.ref_users().child(userData.uid).set({
          username: user.username,
          phone: user.phone,
          gender: user.gender,
          payong: user.payong
        });
        logout();
        resolve("User created successfully!");
      }).catch(function (error) {
        reject("Error: " + error);
      });
    });
  };

  return {
    auth: function() {
      return auth;
    },
    login: login,
    logout: logout,
    register: register
  };
});
