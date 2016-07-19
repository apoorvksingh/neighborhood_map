var locations = [
                  {title: 'Dhaba By Claridges', location: {lat: 28.495699, lng: 77.089238}},
                  {title: 'Starbucks', location: {lat: 28.495645, lng: 77.088760}},
                  {title: 'Imperfecto', location: {lat: 28.495928, lng: 77.088659}},
                  {title: 'The Wine Company', location: {lat: 28.496215, lng: 77.088862}},
                  {title: 'The Beer Cafe', location: {lat: 28.495522, lng: 77.089080}},
                  {title: 'Soi 7', location: {lat: 28.495843, lng: 77.088562}}
                ];

var ViewModel = function() {
    var self = this;
    self.locationsList = ko.observableArray([]);
    console.log(markers);
    for(var index = 0; index <markers.length; index ++) {
        self.locationsList.push(markers[index].title);
    }
    console.log(locationsList);
}
ko.applyBindings(new ViewModel());
