var locationList = [
                      {title: 'Dhaba By Claridges', position: {lat: 28.495699, lng: 77.089238}},
                      {title: 'Starbucks', position: {lat: 28.495645, lng: 77.088760}},
                      {title: 'Imperfecto', position: {lat: 28.495928, lng: 77.088659}},
                      {title: 'The Wine Company', position: {lat: 28.496215, lng: 77.088862}},
                      {title: 'The Beer Cafe', position: {lat: 28.495522, lng: 77.089080}},
                      {title: 'Soi 7', position: {lat: 28.495843, lng: 77.088562}}
                ];

var map;
var markers = [];
var largeInfowindow;
function initMap() {
  var self =this;
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map-view'), {
    center: {lat: 28.495600, lng: 77.088744},
    zoom: 19,
  });
  largeInfowindow = new google.maps.InfoWindow();
  //var bounds = new google.maps.LatLngBounds();
  // Create an onclick event to open an infowindow at each marker.
  /*
  marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }
  */
  ko.applyBindings(new ViewModel());
}
var Location = function(data) {
    this.title = ko.observable(data.title);
    this.position = data.position;
    this.marker = "";
};

var ViewModel = function() {
    var self = this;
    this.locations = ko.observableArray();
    this.keyword = '';
    locationList.forEach(function(location, i) {
      var newLocation = new Location(location);
      newLocation.marker = new google.maps.Marker({
                        map: map,
                        position: location.position,
                        title: location.title.toString(),
                        animation: google.maps.Animation.DROP,
                        id: i
                      });
      self.locations.push(newLocation);
      newLocation.marker.setMap(map);
    });
    if(this.keyword !== '') {
      var filter = ko.computed(function(){
        if(self.locations().length > 0) {
            self.locations().forEach(function(location){
            var newLocation = location;
            newLocation.marker.setVisible(false);
            });
            self.locations.removeAll();
            console.log(self.locations());
            //var keyword = document.getElementById("search-bar").value;
            locationList.forEach(function(locationItem, i){
              if (locationItem.title.toUpperCase().includes(self.keyword.toUpperCase())) {
                  self.locations.push(new Location(locationItem));
                  var marker = new google.maps.Marker({
                                    map: map,
                                    position: locationItem.position,
                                    title: locationItem.title.toString(),
                                    animation: google.maps.Animation.DROP,
                                    id: i
                                  });
                  location.marker = marker;
              }
            });
            self.locations().length = 0;
        }
        else {
            locationList.forEach(function(location, i) {
              var newLocation = new Location(location);
              newLocation.marker = new google.maps.Marker({
                                map: map,
                                position: location.position,
                                title: location.title.toString(),
                                animation: google.maps.Animation.DROP,
                                id: i
                              });
              self.locations.push(newLocation);
              newLocation.marker.setMap(map);
            });
        }
      }, this);
    }
}

//cc78361027869dd4bd7d23945a095e97