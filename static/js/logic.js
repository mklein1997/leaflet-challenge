
// Store API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform get request and send data to features fuction
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + "Location: " + feature.properties.place + "</h3><hr><p>" + "Date: "
        + new Date(feature.properties.time) + "<hr>" + "Magnitude: " + feature.properties.mag + 
        "<hr>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}

// Define layers and basemaps
function createMap(earthquakes) {
    // Add mapbox tile layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap
    };
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create initial map object
    var myMap = L.map("map", {
        center: [
            45.52, -95.07
            ],
        zoom: 3,   
        layers: [streetmap, earthquakes]
    });

    

    //Create layer control and add layers to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    d3.json(queryUrl, function(response) {

        console.log(response);
      
        var heatArray = [];
      
        for (var i = 0; i < response.length; i++) {
          var location = response[i].features.geometry;
      
          if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
          }
        }
      
        var heat = L.heatLayer(heatArray, {
          radius: 20,
          blur: 35
        }).addTo(myMap);
    });

    
}