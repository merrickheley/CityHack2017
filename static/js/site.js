var map;

var db = {
	"startPos": {
		"lon": 153.033466,
		"lat": -27.436418, 
	},
	"finalPos": {
		"lon": 153.038282,
		"lat": -27.452363,
	},
	"startTime": 0700,
	"finalTime": 0900,
};

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
	origin: pointA,
	destination: pointB,
	travelMode: google.maps.TravelMode.TRANSIT
  }, function(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
	  directionsDisplay.setDirections(response);
	} else {
	  window.alert('Directions request failed due to ' + status);
	}
  });
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: db.startPos.lat, lng: db.startPos.lon},
		zoom: 14
	});
	// Instantiate a directions service.
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer({
		map: map,
		options: {
			suppressMarkers: true,
		}
	});

	calculateAndDisplayRoute(directionsService, directionsDisplay,
		new google.maps.LatLng(db.startPos.lat, db.startPos.lon),
		new google.maps.LatLng(db.finalPos.lat, db.finalPos.lon)
	);
}
$(document).ready(function() {
	
});

google.maps.event.addDomListener(window, 'load', initMap);