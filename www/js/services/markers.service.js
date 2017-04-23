angular.module('tomasilong.services')

.factory('MarkersService',function(){
	var markers = [];


	var addMarker = function(map, position, label, icon){
		// for (var i = 0; i < markers.length; i++) {
		// 	if (markers[i].label === label) {
		// 		markers[i].setMap(null);
		// 		markers.splice(i,1);
		// 	}
		// }

		var marker = new google.maps.Marker({
      position: position,
      map: map,
			label: label,
			icon: icon
    });

    markers.push(marker);
	};

	var removeMarkers = function(){
		angular.forEach(markers, function(value,key){
			value.setMap(null);
			markers = [];
		});
	};

  return{
    addMarker: addMarker,
    removeMarkers: removeMarkers,
    get_markers: function () {
      return markers;
    }
  };
});
