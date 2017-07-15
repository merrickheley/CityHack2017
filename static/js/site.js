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
	"startTime": {
		"hour": 7,
		"min": 0,
	},
	"finalTime": {
		"hour": 9,
		"min": 0,
	},
};

minimum = undefined;
minute=60*1000;
function minimiseRoute(startPos, finalPos, startTime, finalTime, finalCallback) {
		
	if (startTime.getTime() < finalTime.getTime()) {
		directionsService.route({
			origin: startPos,
			destination: finalPos,
			travelMode: google.maps.TravelMode.TRANSIT,
			transitOptions: {
				arrivalTime: startTime,
			}
		}, function(dirResult, dirStatus) {
			if (dirStatus == google.maps.DirectionsStatus.OK) {
				console.log(startTime.getHours(), startTime.getMinutes(),
					dirResult.routes[0].legs[0].duration.text);
				
				if ((minimum === undefined) || (dirResult.routes[0].legs[0].duration.value < minimum.routes[0].legs[0].duration.value)) {
					minimum = dirResult;
				}
			} else {
				console.log(startTime.getHours(), startTime.getMinutes(),
					'Directions request failed due to ' + dirStatus
				);
			}
						
			window.setTimeout(function () {
					minimiseRoute(startPos, finalPos, 
						new Date(startTime.getTime() + 10*minute), 
						finalTime, finalCallback
					);
			}, 200);
		});
	}
	else {
		// call final callback
		finalCallback(minimum);
	}
	
}

function initMap() {
	
	gStartPos = new google.maps.LatLng(db.startPos.lat, db.startPos.lon);
	gFinalPos = new google.maps.LatLng(db.finalPos.lat, db.finalPos.lon);
	
	now = new Date();
	
	if (now.getHours() > db.startTime.hour) {
		tomorrow = 1;
	} else {
		tomorrow = 0;
	}
	
	gStartTime = new Date(
		now.getFullYear(), now.getMonth(), now.getDate()+tomorrow,
		db.startTime.hour, db.startTime.min, 0, 0
	);
		
	gFinalTime = new Date(
		now.getFullYear(), now.getMonth(), now.getDate()+tomorrow,
		db.finalTime.hour, db.finalTime.min, 0, 0
	);
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: gStartPos,
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
	
	minimiseRoute(gStartPos, gFinalPos, gStartTime, gFinalTime, function (route) {
		if (!!route) {
			directionsDisplay.setDirections(route);
			
			// route.routes[0].legs[0].arrival_time
			// route.routes[0].legs[0].departure_time
			// route.routes[0].legs[0].duration.text
		}
	});


}
$(document).ready(function() {
	
});

google.maps.event.addDomListener(window, 'load', initMap);