var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(quakeURL, function(quakeData) {
  
  console.log(quakeData.features)

  var earthQuakes = L.geoJSON(quakeData, {
    pointToLayer: function (quakes, latlng) {
      return L.circleMarker(latlng, {
        radius: quakes.properties.mag*3,
        fillColor: getColor(quakes.properties.mag),
        fillOpacity: .75,
        opacity: 1,
        stroke: false,}).bindPopup("Location: " + quakes.properties.place +"<br>Magnitude: " + quakes.properties.mag + "<br> Depth: " + quakes.geometry.coordinates[2])},     
      })
    
    createMap(earthQuakes)
    })

 function getColor(mag) { 
   return mag > 8 ? '#8B0000':
   mag > 7 ? '#FF0000':
   mag > 6 ? '#FF4500':
   mag > 5 ? '#FF8C00':
   mag > 4 ? '#FFA500':
   mag > 3 ? '#FFD700':
   mag > 2 ? '#FFFF00':
   mag > 1 ? '#FFDAB9':
  '#FFE4B5';}

function createMap(earthQuakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", 
  {attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  var overlayMaps = {
    "Earthquakes": earthQuakes
  };

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [lightmap, earthQuakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

var legend = L.control({position: 'topleft'});
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
  grades = [8, 7, 6, 5, 4, 3, 2, 1],
  labels = [];

  var legendTitle = "Earthquakes Magnitude"
  div.innerHTML = legendTitle
  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<li style="background:' + getColor(grades[i] + 1) + '"></li> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

  legend.addTo(myMap);
}

