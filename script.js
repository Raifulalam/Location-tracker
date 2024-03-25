// Function to initialize the map
function initMap() {
    document.getElementById('findLocation').textContent = 'Finding Your Location...';
    // Default coordinates (if geolocation fails)
    var defaultLocation = [40.7128, -74.0060]; // New York, USA

    // Create a map centered at the default location
    var map = L.map('map').setView(defaultLocation, 12);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var userLocation = [position.coords.latitude, position.coords.longitude];

        // Set the map view to the user's location
        map.setView(userLocation, 12);

        // Add a marker at the user's location
        var marker = L.marker(userLocation).addTo(map)
            .bindPopup('Your Location')
            .openPopup();

        // Reverse geocoding to get the address
        var geocodeAPI = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + userLocation[0] + '&lon=' + userLocation[1];
        fetch(geocodeAPI)
            .then(response => response.json())
            .then(data => {
                document.getElementById('findLocation').style.display = 'none';
                document.querySelector('.location-container').style.display = '';
                document.getElementById('address').innerText = 'Address: ' + data.display_name;
            })
            .catch(error => console.log('Error fetching address:', error));
        }, function() {
        handleLocationError(true, defaultLocation);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, defaultLocation);
    }
}

// Function to handle errors in geolocation
function handleLocationError(browserHasGeolocation, defaultLocation) {
    var map = L.map('map').setView(defaultLocation, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker(defaultLocation).addTo(map)
        .bindPopup(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.')
        .openPopup();
}
