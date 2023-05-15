const sample= "https://raw.githubusercontent.com/nburwick/Cerulean/main/static/Resources/Tornado_Tracks.geojson";

let tornadoes, heat, heatmapLayer;

// Fetch the data from the URL using d3.json
d3.json(sample).then(data => {
  console.log(data)
  // Create a list of dictionaries
  tornadoes = data.features.map(feature => {
    const properties = feature.properties;
    return {
      id: properties.OBJECTID,
      elat: properties.elat,
      elon: properties.elon,
      slat: properties.slat,
      slon: properties.slon,
      magnitude: properties.mag,
      year: properties.yr
    };
  });

// Function to create the dropdown options
function createDropDown(data) {
  const features = data.features;

  // Access the "yr" values and remove duplicates
  const yrValues = [...new Set(features.map(feature => feature.properties.yr))];

  // Sort the "yr" values in ascending order
  yrValues.sort((a, b) => d3.ascending(a, b));

  // Create the dropdown options
  d3.select("#years")
    .selectAll("option")
    .data(yrValues)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);
}

// Update the heat map layer when the year is changed
const updateHeatMap = (year) => {
  // Get the selected year from the dropdown if not passed as an argument
  if (!year) {
    year = d3.select("#years").property("value");
  }
  
  // Filter the tornadoes array by the year
  const filteredTornadoes = tornadoes.filter(tornado => parseInt(tornado.year) === parseInt(year));

  // Update the coordinates variable with the filtered values
  const filteredCoordinates = filteredTornadoes.map(tornado => [tornado.slat, tornado.slon]);

  // filter the data based on the selected year
  if (typeof d3.data !== 'undefined') {
  const filteredData = d3.data.filter(d => d.year === year);
}
  // clear the previous layer and add new heatmap layer
  if (heatmapLayer) {
    map.removeLayer(heatmapLayer);
  }
  
  // Update the heat layer with the new coordinates
  heatmapLayer = L.heatLayer(filteredCoordinates, {radius: 20}).addTo(map);
}

// Create a Leaflet map object and add the heat map layer
const map = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Update the coordinates variable with latitudes and longitudes from the tornado data
const coordinates = tornadoes.map(tornado => [tornado.slat, tornado.slon]);

heat = L.heatLayer(coordinates, {
  radius: 25,
  minOpacity: 0.3,
  gradient: {0.1: 'blue', 0.3: 'green', 0.6: 'yellow', 0.8: 'orange', 1: 'red'}
}).addTo(map);

// Create the dropdown options
createDropDown(data);
// Add event listener for the update button
document.getElementById("update-btn").addEventListener("click", function() {
  const year = document.getElementById("years").value;
  updateHeatMap(year);
});

});
