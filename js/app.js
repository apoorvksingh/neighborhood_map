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

function initMap() {
  var self =this;
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map-view'), {
    center: {lat: 28.495900, lng: 77.088744},
    zoom: 19,
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
  // Create an onclick event to open an infowindow at each marker.
  ko.applyBindings(new ViewModel());
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
      /*
      var wikiText = "";
      var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ marker.title + "&format=json&callback=wikiCallBack";
      var wikiTimeout = setTimeout(function() {
        $('#wikipedia-header').text('Failed to get Wiki Links');
      }, 2000);
      $.ajax({
        url: wikiURL,
        dataType:"jsonp",
        success: function(data){
          var wikiList = data[1];

          for( var index = 0; index < wikiList.length; index++) {
              var article = "<li class=\"article\"><a href=\"" + data[3][index] + "\">" + data[1][index] + "</a></li>";
              wikiText += article;
          }
          infowindow.setContent('<div><ul>' + wikiText + '</ul></div>');
          clearTimeout(wikiTimeout);
        }
      });
      */
      infowindow.setContent('<div>' + marker.title.toUpperCase() + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
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
};

var ViewModel = function() {
    var self = this;
    this.locations = ko.observableArray();
    self.keyword = ko.observable('');
    locationList.forEach(function(location, i) {
      var newLocation = new Location(location);
      newLocation.marker = new google.maps.Marker({
                        map: map,
                        position: location.position,
                        title: location.title.toString(),
                        animation: google.maps.Animation.DROP,
                        icon: 'https://www.google.com/mapfiles/marker.png',
                        id: i
                      });
      newLocation.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
      self.locations.push(newLocation);
      newLocation.marker.setMap(map);
    });
    var filter = ko.computed(function(){
      if(self.keyword() != '') {
        self.locations().forEach(function(location){
          if (!location.marker.title.toUpperCase().includes(self.keyword().toUpperCase())) {
              location.marker.setVisible(false);
          }
          else {
              location.marker.setVisible(true);
          }
        });
      }
      else {
          self.locations().forEach(function(location){
              location.marker.setVisible(true);
          });
      }
    }, this);
}

//cc78361027869dd4bd7d23945a095e97