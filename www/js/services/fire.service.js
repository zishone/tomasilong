angular.module('tomasilong.services')

.factory("FireService", function ($q) {
  var ref = firebase.database().ref();
  var ref_users = firebase.database().ref().child('users');
  var ref_nagpapasilong = firebase.database().ref().child('nagpapasilong');
  var ref_makikisilong = firebase.database().ref().child('makikisilong');
  var ref_link = firebase.database().ref().child('link');

  return {
    ref: function() {
      return ref;
    },
    ref_users: function() {
      return ref_users;
    },
    ref_nagpapasilong: function() {
      return ref_nagpapasilong;
    },
    ref_makikisilong: function() {
      return ref_makikisilong;
    },
    ref_link: function() {
      return ref_link;
    }
  };
});
