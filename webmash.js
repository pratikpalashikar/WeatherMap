// Put your zillow.com API key here

var username = "pratikpalashikar";
var request = new XMLHttpRequest();
var map;
var markerArray = [];
var contentString = "";
var addressList = new Array();

function initMap() {

    var myLatLng = {
        lat: 32.75,
        lng: -97.13
    };
    var geocoder = new google.maps.Geocoder;
    var marker;
    //Zooms to the default position as mentioned in the assignment
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 32.75,
            lng: -97.13
        },
        zoom: 17
    });
    //displays the content String along with the address and the weather details
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    //Places the marker on the map
    function placeMarker(myLatLng) {
        clearMarkers();
        marker = new google.maps.Marker({
            position: myLatLng,
            map: map
        });

        google.maps.event.addListener(marker, 'mouseover', function(event) {
            infowindow.open(map, marker);
        });
        markerArray.push(marker);

    }

    google.maps.event.addListener(map, 'click', function(event) {
        contentString = "";
        placeMarker(event.latLng);
        reversegeocode(event.latLng, infowindow, geocoder);
        infowindow.open(map, marker);
    });

}


function clean() {
    addressList = [];
    document.getElementById("result").innerHTML = "";

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
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

// Reserse Geocoding
function reversegeocode(myLatLng, infowindow, geocoder) {

    //get the latitude and longitude from the mouse click and get the address
    var lat = myLatLng.lat();
    var lng = myLatLng.lng();
    sendRequest(lat, lng, infowindow, geocoder);

} // end of geocodeLatLng()



function displayResult() {
    if (request.readyState == 4) {
        //Not used
    }
}

function sendRequest(lat, lng, infowindow, geocoder) {
    //  request.onreadystatechange = displayResult;
    request.open("GET", "http://api.geonames.org/findNearByWeatherXML?lat=" + lat + "&lng=" + lng + "&username=" + username);
    request.onreadystatechange = function() {
        var address;

        if (request.readyState == 4) {


            var xml = request.responseXML.documentElement;
            var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
            var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
            var windspeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
            contentString += "Temp : " + temperature + " Clouds :" + clouds + " WindSpeed :" + windspeed;
            //Get the address as well by doing the reverse geocode
            var latLng = {
                lat: lat,
                lng: lng
            };
            geocoder.geocode({
                'location': latLng
            }, function(results, status) {
                if (status == "OK") {
                    address = results[1].formatted_address;
                    infowindow.setContent(address + "<br>" + contentString);
                    addressList.push(address);
                    document.getElementById("result").innerHTML += "<li>" + address + "<br>" + "Weather Details" + contentString + "</li>";
                    /*  for (var i = 0; i < addressList.length; i++) {
                          document.getElementById("result").innerHTML += "<li>" + addressList[i] + "</li>";
                      }*/
                }
            });


        }
    };
    request.send(null);
}
