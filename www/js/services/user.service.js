angular.module('tomasilong.services')

.factory("UserService", function ($q, AuthService, FireService) {
  var userData;

  var get_user_data = function() {
    return $q(function(resolve, reject) {
      FireService.ref_users().child(AuthService.auth().currentUser.uid).once('value').then(function(snapshot) {
        userData = snapshot.val();
        userData.email = AuthService.auth().currentUser.email;
        resolve(userData);
      });
    });
  };

  var change_payong_status = function(payongStatus) {
    return $q(function(resolve, reject) {
      FireService.ref_users().child(AuthService.auth().currentUser.uid).child("payong").set(payongStatus).then(function() {
        if(payongStatus){
          FireService.ref_nagpapasilong().child(userData.username).set({
            data: userData
          });
        }else{
          FireService.ref_nagpapasilong().child(userData.username).remove();
        }
        resolve("Status Changed!");
      });
    });
  };

  var set_location = function(lat, lng) {
    get_user_data().then(function() {
      return $q(function(resolve, reject) {
        if(userData.payong){
          FireService.ref_nagpapasilong().child(userData.username).child("location").set({
            lat: lat,
            lng: lng
          }).then(function() {
            resolve("Location Set!");
          });
        }
      });
    });
  };

  var add_to_makikisilong = function(pickup, dropoff) {
    return $q(function(resolve, reject) {
      FireService.ref_makikisilong().child(userData.username).set({
        data: userData,
        pickup: pickup,
        dropoff: dropoff
      });
      resolve("Added to Makikisilong!");
    });
  };

  var remove_from_makikisilong = function() {
    return $q(function(resolve, reject) {
      FireService.ref_makikisilong().child(userData.username).remove();
      resolve("Removed from Makikisilong!");
    });
  };

  var remove_from_makikisilong2 = function(user) {
    return $q(function(resolve, reject) {
      FireService.ref_makikisilong().child(user).remove();
      resolve("Removed from Makikisilong!");
    });
  };

  var remove_from_nagpapasilong = function() {
    return $q(function(resolve, reject) {
      FireService.ref_nagpapasilong().child(userData.username).remove();
      resolve("Removed from Makikisilong!");
    });
  };

  var create_link = function(id, data) {
    return $q(function(resolve, reject) {
      remove_from_makikisilong2(data.makikisilong.data.username);
      remove_from_nagpapasilong();
      FireService.ref_link().child(id).set(data);
      resolve("Link Created!");
    });
  };

  var remove_link = function(user) {
    return $q(function(resolve, reject) {
      FireService.ref_link().child(user).remove();
      resolve("Removed Link!");
    });
  };

  var change_link_status = function(user) {
    return $q(function(resolve, reject) {
      FireService.ref_link().child(user).child("status").set("onway").then(function() {
        resolve("Status Changed!");
      });
    });
  };

  return {
    get_user_data: get_user_data,
    change_payong_status: change_payong_status,
    set_location: set_location,
    add_to_makikisilong: add_to_makikisilong,
    remove_from_makikisilong: remove_from_makikisilong,
    create_link: create_link,
    remove_link: remove_link,
		change_link_status: change_link_status
  };
});
