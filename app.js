
// //const url = "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Tornado_Tracks_1950_2017_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
d3.json("tornado_Tracks.geojson").then(data => {
  // Create a list of dictionaries
  let tornadoes = [];
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
  };

  console.log(tornadoes);

  let tornadoarray = [];
  for (var i = 0; i < tornadoes.length; i++) {
    tornadoarray.push([tornadoes[i].slat, tornadoes[i].slon, tornadoes[i].year])
  };
  console.log(tornadoarray);

  //________________________________________________________
  //dropdown
  //________________________________________________________

  let years = [];
  for (var i = 0; i < tornadoes.length; i++) {
    if (!years.includes(tornadoes[i].year)) {
      years.push(tornadoes[i].year);
    }
  };

  console.log(years);

  var select = d3.select("#selDataset");

  years.forEach((year) => {
    select.append("option")
      .text(year)
      .property("value",year);
  });

  //___________________________________________________
  // Create a custom filtering function
  //___________________________________________________

  function select_year(year) {
    return tornadoarray.filter(tornado => tornado[2] == year);
  };
  
  // Set the default year to display on the map
  let defaultYear = 2022;
  
  // Create a function to update the map based on the selected year
  function updateMap(year) {
    // Filter the tornadoarray based on the selected year
    let tornado_year = select_year(year);
    
    // Remove the previous heat layer from the map
    if (heat) {
      myMap.removeLayer(heat);
    }
    
    // Create a new heat layer with the filtered data and add it to the map
    heat = L.heatLayer(tornado_year, {
      radius: 10,
      minOpacity: 0.4,
      gradient: { 0.4: 'blue', 0.5: 'lime', 0.6: 'red' }
    }).addTo(myMap);

    //  let yearLabel = document.getElementById("year-label");
    // yearLabel.innerHTML = year;
  };
  
  // Add an event listener to the dropdown to update the map when a new year is selected
  d3.select("#selDataset").on("change", function() {
    let selectedYear = d3.event.target.value;
    updateMap(selectedYear);
  });
  
  // Initialize the map with the default year
  let tornado_year = select_year(defaultYear);
  var myMap = L.map("map").setView([37.0902, -95.7129], 4.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  let heat = L.heatLayer(tornado_year, {
    radius: 10,
    minOpacity: 0.4,
    gradient: { 0.4: 'blue', 0.5: 'lime', 0.6: 'red' }
  }).addTo(myMap);
});

