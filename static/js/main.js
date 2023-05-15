// Connect to Flask API

function update_api(state){
    let st = state || "all"
    var url = `http://localhost:8000/api/v1.0/${st}`
    return url
}

// Create function to initialize map to be called later with API Data
function render(){d3.json(update_api()).then(function(data){
    createMap(data)
});}

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
function onEachFeature(feature) {
    return `<h3>Tornado ID: ${feature.properties.OBJECTID}</h3><hr><p>Date/Time: ${new Date(feature.properties.Date_Calc)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Loss: $${(feature.properties.loss).toLocaleString()}</p><p>Length (Miles): ${feature.properties.len}</p>`;
}

// Create function to return style object for bubble and tracks layers on map
function createStyle(feature){
    var style ={
        color: chooseColor(feature.properties.mag), // d.properties.loss or d.properties.mag .... 
        weight: chooseWeight(feature.properties.mag)
}
return style
}

// Create function to make Tornado Tracks Layer Group Features
function createTracks(data){
    // Create a GeoJSON layer that contains the features array on the tornados object.
    // Run the onEachFeature function once for each piece of data in the array.
    var tornado_tracks = []
    
    data.forEach(x => {

        tornado_tracks.push(L.geoJSON(x,{
            style: createStyle
        }).bindPopup(onEachFeature(x)))
    })
  
    // Send our tornado tracks layer to variable
    return tornado_tracks
}

// Create function to make bubble layer
function createBubbles(data){

    var tornado_bubbles = [];
    data.forEach(x => {
        // Get Coordinates of bubbles
        var lng = x.properties.slon;
        var lat = x.properties.slat;

        var style = {
            stroke: false,
            fillOpacity: 0.8,
            fillColor: chooseColor(x.properties.mag),
            radius: chooseWeight(x.properties.mag) * 10000
        }

        // Create bubble and push to Tornado Bubbles array
        tornado_bubbles.push(L.circle([lat, lng], style).bindPopup(onEachFeature(x),{maxWidth: 560}))
    });
    // return tornado_bubbles array
    return tornado_bubbles
}

// Create map
function createMap(data, year){
    // Filter Data by Year?
    var yr = year || 0
    var tornados = data
    if(yr != 0){
        tornados = data.filter(feature => feature.properties.yr == year)
    }
    console.log(tornados)
    // Create Tile Layers
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
    
        // Create layer groups
        var tracks = L.layerGroup(createTracks(tornados))
        var bubbles = L.layerGroup(createBubbles(tornados))
        // Create an overlay object to hold our overlay.
        
        var overlayMaps = {
            "Tornado Tracks": tracks,
          //   "Heat Map": createHeat(data, year),
            "Bubble Map": bubbles,
        };

    // Create our map, giving it the satellite map and tornados layers to display on load.
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [outdoors, tracks]
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
}


// Create DropDown for Years


// Create DropDown for State


// render first view of map
render();