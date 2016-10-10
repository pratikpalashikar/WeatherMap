// Put your zillow.com API key here

var username = "pratikpalashikar";
var request = new XMLHttpRequest();
var map;
var markerArray = [];
var contentString = "";
function initMap() {

	var myLatLng = {lat: 32.75, lng: -97.13};
	var marker;
	map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 32.75, lng: -97.13},
			zoom: 17
	});
	var infowindow = new google.maps.InfoWindow({
          content: contentString
  });

	function placeMarker(myLatLng){
	 clearMarkers();
	 marker = new google.maps.Marker({
					 position: myLatLng,
					 map: map
	 });
	google.maps.event.addListener(marker,'mouseover', function(event) {
 			infowindow.open(map,marker);
 		});
	 markerArray.push(marker);
	 }
	google.maps.event.addListener(map,'click', function(event) {
		contentString = "";
		placeMarker(event.latLng);
		reversegeocode(event.latLng,infowindow);
		infowindow.open(map,marker);
	});
}




function setMapOnAll(map) {
			 for (var i = 0; i < markerArray.length; i++) {
				 markerArray[i].setMap(map);
				}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markerArray) {
			 setMapOnAll(null);
}

//Wait for some time before proceeding
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

// Reserse Geocoding
function reversegeocode(myLatLng,infowindow) {

  //get the latitude and longitude from the mouse click and get the address
	var lat = myLatLng.lat();
	var lng = myLatLng.lng();
	sendRequest(lat,lng,infowindow);

}// end of geocodeLatLng()



function displayResult () {
    if (request.readyState == 4) {
			//Not used
    }
}
*/
function sendRequest (lat,lng,infowindow) {
  //  request.onreadystatechange = displayResult;
    request.open("GET","http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username);
		request.onreadystatechange = function() {
		    if (request.readyState == 4) {

		        var xml = request.responseXML.documentElement;
						var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
						var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
						var windspeed =  xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
						contentString += "Temp : "+ temperature +" Clouds :"+clouds+" WindSpeed :"+windspeed;
						console.log("inside dispresult" + contentString);
						infowindow.setContent(contentString);

		    }
		};
		  request.send(null);
}
