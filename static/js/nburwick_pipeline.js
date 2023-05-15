// Connect to Flask API

function update_api(state){
    let st = state || "TX"
    var url = `http://localhost:8000/api/v1.0/${st}`
    return url
}



// Initialize and create features from Flask-API Data
function render(){
    var yr = 2022
    d3.json(update_api("AZ")).then(function(data, year){
    createFeatures(data, yr)
});}


function createFeatures(data, year){
    var yr = year
    createPaths(data, yr)
}

// Create a function to map colors to features and legend related to Magnitude (mag)
function chooseColor(mag){
    if (mag < 1) return "#00FF00";
    else if (mag < 2) return "greenyellow";
    else if (mag < 3) return "yellow";
    else if (mag < 4) return "orange";
    else if (mag < 5) return "orangered";
    else return "#FF0000";
  }

// Create function to map weights to lines related to Magnitude (mag)
  function chooseWeight(mag){
    if (mag < 1) return 1;
    else if (mag < 2) return 2;
    else if (mag < 3) return 3;
    else if (mag < 4) return 4;
    else if (mag < 5) return 5;
    else return 6;
  }

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the tornado.
function onEachFeature(feature, layer) {
layer.bindPopup(`<h3>Tornado ID: ${feature.properties.OBJECTID}</h3><hr><p>Date/Time: ${new Date(feature.properties.Date_Calc)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Loss: $${(feature.properties.loss).toLocaleString()}</p><p>Length (Miles): ${feature.properties.len}</p>`,{maxWidth: 560});
}

function createStyle(feature){
    var style ={
        color: chooseColor(feature.properties.mag), // d.properties.loss or d.properties.mag .... 
        weight: chooseWeight(feature.properties.mag)
}
return style
}

// Create function to create features and popups per data.
function createPaths(data, year) {
    console.log(data)
        // Filter Data by Year?
        var yr = year || 0
        var tornados = data
        if(yr != 0){
            tornados = data.filter(feature => feature.properties.yr == year)
        }
    console.log(tornados)

    // Create a GeoJSON layer that contains the features array on the tornados object.
    // Run the onEachFeature function once for each piece of data in the array.
    var tornado_data = L.geoJSON(tornados, {
      onEachFeature: onEachFeature,
      style: createStyle
    })
  
    // Send our tornado tracks layer to variable
    createMap(tornado_data);
  }

function createMap(tornados) {
    


    // Create tile layers
    var outdoors = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });
  
    var gray = new L.StamenTileLayer("toner-lite");
  
      // Create a baseMaps object.
      var baseMaps = {
        "Grayscale": gray,
        "Outdoors": outdoors,
      };
  
      // Create an overlay object to hold our overlay.
      var overlayMaps = {
          "Tornado Tracks": tornados,
        //   "Heat Map": heat,
        //   "Bubble Map": bubble,
      };
      
      // Create our map, giving it the satellite map and tornados layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [gray, tornados]
    });
  
  // Add legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    mag = [-10, -1, 1, 2, 3, 4];
  
    div.innerHTML += "<h3 style='text-align: center'>Magnitude</h3>"
  
    for (var i = 0; i < mag.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(mag[i] + 1) + '"></i> ' + mag[i] + (mag[i + 1] ? ' &ndash; ' + mag[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap)
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  };


  // Initialize render
  render();

  function optionChange(state){
    update_api(state);
  }