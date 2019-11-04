// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map-id", {
  center: [39.5, -99.00],
  zoom: 5,

});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

function bindpopup(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag);
}

// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "mag",

    // Set color scale
//    scale: ["#ffffb2", "#b10026"]
      scale: ["00FF00", "FF0000"],

    // Number of breaks in step range
    steps: 6,

    // q for quartile, e for equidistant, k for k-means
    mode: "e",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    // Binding a pop-up to each layer
    onEachFeature: bindpopup,
    pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: feature.properties.mag* 3,
                                                fillOpacity: 1,
                                                color: 'black',
                                                weight: 1,});
            },
  }).addTo(map);

    // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h3>Earthquake Magnitude</h3>" +
      "<div class=\"labels\">" +
//        "<div class=\"min\">" + limits[0] + "</div>" +
//        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    var grades = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">&nbsp;&nbsp;"+grades[index]+"</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);


  })
