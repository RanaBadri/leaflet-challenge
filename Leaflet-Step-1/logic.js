// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

function changeColor(feature) {

  console.log(feature)

  let depth = feature.geometry.coordinates[2]

  if (depth > 7) {
    return "Violet";
  }
  else if (depth > 6) {
    return "Indigo";
  }
  else if (depth > 5) {
    return "blue";
  }
  else if (depth > 4) {
    return "green";
  }
  else if (depth > 3) {
    return "Yellow";
  }
  else if (depth > 2) {
    return "orange";
  }
  else if (depth > 1) {
    return "red";
  }
  else {
    return "pink";
  }
}

// 2. 
function createFeatures(earthquakeData) {

  // Save the earthquake data in a variable.
  function onEachFeature(feature, layer) {

    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}`)
  }

  let earthquakes = L.geoJson(earthquakeData, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        color: "white",
        weight: 0.3,
        radius: feature.properties.mag * 5,
        fillOpacity: 1,
        fillColor: changeColor(feature)
      }
    },
    onEachFeature: onEachFeature
  })

  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);
}

// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.
  var overlayMaps = {
    "Earthquakes": earthquakes,
  };
  
  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


//Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0,1,2,3,4,5,6,7,8,],
      colors = ['pink','red', 'orange','yellow', 'green', 'blue','indigo','violet',];

    //loop through our density intervals and generate a label with colored circles for each interval
    for (var i=0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background: ' + colors[i] + '"></i> ' +
          grades[i] + (grades[i+ 1] ? '&ndash;' + grades[i +1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
}
