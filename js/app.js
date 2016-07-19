var locations = [
                      {title: 'Dhaba By Claridges', location: {lat: 28.495699, lng: 77.089238}},
                      {title: 'Starbucks', location: {lat: 28.495645, lng: 77.088760}},
                      {title: 'Imperfecto', location: {lat: 28.495928, lng: 77.088659}},
                      {title: 'The Wine Company', location: {lat: 28.496215, lng: 77.088862}},
                      {title: 'The Beer Cafe', location: {lat: 28.495522, lng: 77.089080}},
                      {title: 'Soi 7', location: {lat: 28.495843, lng: 77.088562}}
                ];

var Location = function(data) {
    this.title = ko.observable(data.title);
};
var ViewModel = function() {
    var self = this;
    this.locList = ko.observableArray([]);
    locations.forEach(function(locationItem){
        self.locList.push(new Location(locationItem));
    })
}
ko.applyBindings(new ViewModel());
