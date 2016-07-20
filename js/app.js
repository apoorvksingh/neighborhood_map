'use strict';
//Creating the list of locations to be displayed on the map
var locationList = [
                      {title: 'Dhaba By Claridges', position: {lat: 28.495699, lng: 77.089238}},
                      {title: 'Starbucks', position: {lat: 28.495645, lng: 77.088760}},
                      {title: 'Imperfecto', position: {lat: 28.495928, lng: 77.088659}},
                      {title: 'The Wine Company', position: {lat: 28.496215, lng: 77.088862}},
                      {title: 'The Beer Cafe', position: {lat: 28.495522, lng: 77.089080}},
                      {title: 'Soi 7', position: {lat: 28.495843, lng: 77.088562}},
                      {title: 'Kitchens of Asia', position: {lat: 28.495651, lng: 77.089165}},
                      {title: 'Pind Balluchi', position: {lat: 28.495781, lng: 77.088817}},
                      {title: 'Zambar', position: {lat: 28.495709, lng: 77.088707}},
                      {title: 'Johnny Rockets Express', position: {lat: 28.495997, lng: 77.089114}}
                ];

var map;
var markers = [];
var largeInfowindow;
//Initializing the map to be displayed on the site
function initMap() {
  var self =this;
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map-view'), {
    center: {lat: 28.495900, lng: 77.088744},
    zoom: 19,
    //onerror: window.alert("Sorry! Map could not be loaded"),
    styles: [
      {
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  });
  largeInfowindow = new google.maps.InfoWindow();
  ko.applyBindings(new ViewModel());
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
      //The infowindow gets data from foursquare for each marker and displays it
      var foursquareURL = "https://api.foursquare.com/v2/venues/search?query="+ marker.title +"&ll=" +marker.position.lat()+ "," +marker.position.lng()+ "&oauth_token=UTED5VEK0E1IPANN51ZEERAXB1ZI1P1URFRRFXZ3J3YKKWFP&v=20160720";
      console.log(foursquareURL);
      var text = "";
      var fourSqTimeout = setTimeout(function() {
        window.alert("Error! Failed to get data");
      }, 5000);
      $.ajax({
        url: foursquareURL,
        dataType:"jsonp",
        success: function(data){
          var fourSqList = data.response.venues;
          var infowindowContent = '<div>';
          infowindowContent += '<h3>' +fourSqList[0].name+ '</h3>';
          infowindowContent += '<p>' +fourSqList[0].location.address+ '</p>';
          infowindowContent += '<p> Checkins :' +fourSqList[0].stats.checkinsCount+ '</p><br />';
          infowindowContent += '<h6>Data Provided by Foursquare</h6>';
          infowindowContent += '</div>';
          infowindow.setContent(infowindowContent);
          clearTimeout(fourSqTimeout);
        }
      });
      //infowindow.setContent('<div>' + marker.title.toUpperCase() + '</div>');
      infowindow.open(map, marker);
      // Making sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker.setIcon('https://www.google.com/mapfiles/marker.png');
        infowindow.marker = null;
      });
    }
}

var Location = function(data) {
    this.title = ko.observable(data.title);
    this.position = data.position;
    this.marker = "";
    this.visibility = ko.observable(true);
};

var ViewModel = function() {
    var self = this;
    this.locations = ko.observableArray();
    self.keyword = ko.observable('');

    self.showInfo = function() {
      /*self.locations().forEach(function(location, i) {
          populateInfoWindow(location.marker, largeInfowindow);
      });*/
    }
    //creating an array of Location objects that contain markers for each location
    locationList.forEach(function(location, i) {
      var newLocation = new Location(location);
      //Creating a new marker for each location
      newLocation.marker = new google.maps.Marker({
                        map: map,
                        position: location.position,
                        title: location.title.toString(),
                        animation: google.maps.Animation.DROP,
                        icon: 'https://www.google.com/mapfiles/marker.png',
                        id: i
                      });
      newLocation.marker.addListener('click', function() {
        for (var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.setIcon('https://www.google.com/mapfiles/marker.png');
            }
        populateInfoWindow(this, largeInfowindow);
      });
      self.locations.push(newLocation);
      newLocation.marker.setMap(map);
    });

    //The FILTER computed property takes the input as a string from the search box, checks if that
    //string is contained in any of the location titles and displays only those locations
    this.filter = ko.computed(function(){
      if(self.keyword() != '') {
        self.locations().forEach(function(location){
          if (!location.marker.title.toUpperCase().includes(self.keyword().toUpperCase())) {
              location.marker.setVisible(false);
              location.visibility = false;
          }
          else {
              location.marker.setVisible(true);
              location.visibility = true;
          }
          console.log(location.visibility);
        });
      }
      else {
          self.locations().forEach(function(location){
              location.marker.setVisible(true);
              location.visibility = true;
          });
      }

    }, this);
}

//cc78361027869dd4bd7d23945a095e97