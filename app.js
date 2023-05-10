// Get the url endpoint
const sample = "https://raw.githubusercontent.com/nburwick/Cerulean/main/static/Resources/Tornado_Tracks.geojson";

// Get the .json data from the URL
d3.json(sample)
  .then(function(data) {
    console.log(data);

    createDropDown(data);
  })
  .catch(function(error) {
    console.error(error);
  });
// Function to create the dropdown options
function createDropDown(data) {
  var features = data.features;

  // Access the "yr" values and remove duplicates
  var yrValues = [...new Set(features.map(feature => feature.properties.yr))];

  // Sort the "yr" values in ascending order
  yrValues.sort(function(a, b) {
    return d3.ascending(a, b);
  });

  // Create the dropdown options
  d3.select("#years")
    .selectAll("option")
    .data(yrValues)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    })
    .on("change", function() {
      var year = d3.select(this).property("value");
     
    });
} // <--- Add this closing curly bracket

// Fetch the data from the URL using d3.json
d3.json("Tornado_Tracks.geojson").then(data => {
  // Create a list of dictionaries
  var tornadoes = [];
  for (const feature of data.features) {
    const properties = feature.properties;
    const tornado = {
      id: properties.OBJECTID,
      elat: properties.elat,
      elon: properties.elon,
      slat: properties.slat,
      slon: properties.slon,
      magnitude: properties.mag,
      year: properties.yr
    };
    tornadoes.push(tornado);
  }

  console.log(tornadoes);

  // Create a Leaflet map and add the heat map layer
  var myMap = L.map("map").setView([37.0902, -95.7129], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Update the coordinates variable with latitudes and longitudes from the tornado data
  coordinates = tornadoes.map(function (tornado) {
    return [tornado.slat, tornado.slon, tornado.year];
  });

  console.log(coordinates);

  // Create a heat map layer with a default filter for all years
  let heat = L.heatLayer(coordinates.filter(function(tornado) {return tornado[2] >= 1950 && tornado[2] <= 2021}), {
    radius: 25,
    minOpacity : 0.4,
    gradient:{0.4:'blue', 0.5:'lime', 0.6:'red'}}).addTo(myMap);

  // Create a year range using d3
  const yearExtent = d3.extent(tornadoes, d => d.year);
  const yearRange = d3.range(yearExtent[0], yearExtent[1] + 1);

  // Add a range input slider to filter the data by year
  var slider = document.getElementById("year-range");
  slider.min = yearExtent[0];
  slider.max = yearExtent[1];
  slider.value = yearExtent[0];
  slider.oninput = function() {
    // Update the heat map layer with the new filter
    heat.setLatLngs(coordinates.filter(function(tornado) {return tornado[2] >= slider.value}));
  }

});





  
  

