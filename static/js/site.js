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
		"hour": 8,
		"min": 30,
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
	
	if (document.getElementById('map') !== null) {
		map = new google.maps.Map(document.getElementById('map'), {
			center: gStartPos,
			zoom: 14
		});

		directionsDisplay = new google.maps.DirectionsRenderer({
			map: map,
			options: {
				suppressMarkers: true,
			}
		});
	}

	directionsService = new google.maps.DirectionsService;

	minimiseRoute(gStartPos, gFinalPos, gStartTime, gFinalTime, function (route) {
		if (!!route) {
			if(document.getElementById('map') !== null) {
				if($('#secondViewPage').length) {
					directionsService.route({
						origin: gStartPos,
						destination: gFinalPos,
						travelMode: google.maps.TravelMode.TRANSIT,
						transitOptions: {
							arrivalTime: new Date(gFinalTime - 20*minute),
						}
					}, function(dirResult, dirStatus) {
					if (dirStatus == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(dirResult);
					}
					console.log(dirStatus)
					});
				} else {
					directionsDisplay.setDirections(route);
				}
			}
			
			localStorage.setItem("arriveTime", route.routes[0].legs[0].arrival_time.text);
			localStorage.setItem("leaveTime", route.routes[0].legs[0].departure_time.text);
			localStorage.setItem("duration", route.routes[0].legs[0].duration.text.text);
		}
	});

}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

$(document).ready(function() {
	
	$('#arriveTime').text(localStorage.getItem("arriveTime"));
	$('#leaveTime').text(localStorage.getItem("leaveTime"));
	var wakeupDate = new Date(new Date("2017","06","16",localStorage.getItem("leaveTime").split(':')[0],localStorage.getItem("leaveTime").split(':')[1]) - localStorage.getItem("readyTime")*60000);
	$('#wakeupTime').text(addZero(wakeupDate.getHours()) + ":" + addZero(wakeupDate.getMinutes()));

	// Save items from the settings page
	// from, to, readyTime, arriveRange, sleepHours, notifications
	$('#confirmChangeSettings').click(function(e) {
		e.preventDefault();
		var href = $( this ).attr( "href" );

		localStorage.setItem("from",$('#from').val());
		localStorage.setItem("to",$('#to').val());
		localStorage.setItem("readyTime",$('#readyTime').val().split(' ')[0]);
		localStorage.setItem("arriveRange",$('#arriveRange').val());
		localStorage.setItem("notifications",$('#notifications').val());

		location.href = href;
	})

});

google.maps.event.addDomListener(window, 'load', initMap);