
var myMap = null;

// Get the url endpoint
const sample = "https://raw.githubusercontent.com/nburwick/Cerulean/main/static/Resources/Tornado_Tracks.geojson";


d3.json(sample)
  .then(function(data){

    console.log(data);        
   
    // call the createFeatures function
    createDropDown(data);
    // createFeatures(data.features, 1952); // send the features property over
    createFeatures(data, 1950); // send the features property over
})
.catch(function(error) {
  console.error(error);
});

function generateTitle(year)
{

    // Assuming you have a reference to the div element with id "title"
  var titleDiv = document.getElementById("title");

  // Create a new text node for the title
  var titleText = "";
  titleText = document.createTextNode("Tornados Data for the year: " + year);

  // Append the text node to the div element
  titleDiv.innerHTML = "";
  titleDiv.appendChild(titleText);


}

// main function - process data and create map
// make functions to process the data, year is the year selected from drop down
function createFeatures(tornadosData, year)
{

    generateTitle(year);
   
    console.log("year selected: " + year);
    // console.log(tornadosData); // extract the data for our popups for each point
    // alert(feature.properties.yr);
    // filter for the year selected
    var filteredData = tornadosData.features.filter(feature => feature.properties.yr == year);
    
    console.log("filteredData.length == " + filteredData.length); 
    console.log(filteredData);

    // Create a circle for each tornado in the dataset
    var tornado_bubbles = []

    try
    {
        filteredData.forEach(x => {
            // starting coordinate of tornado_bubbles
            // var lng=x.geometry.coordinates[0][0];
            // var lat=x.geometry.coordinates[0][1];

            var lng = x.properties.slon;
            var lat = x.properties.slat;

            // if (x.geometry === null)
            // {
            //   // skip if null
            //     ;
            // }
            // else
            // {
              // lng=x.geometry.coordinates[0][0];
              // lat=x.geometry.coordinates[0][1];

              // tornado_bubbles.push(
              //   L.circle([lat,lng], {
              //       stroke: false,
              //       fillOpacity: 0.8,
              //       fillColor: circleColor(x.properties.mag),
              //       radius: circleSize(x.properties.mag)
              //   }).bindPopup(
              //       "<h5> State: " + x.properties.st + "</h5>" +
              //       "<hr><p>" + x.properties.Date_Calc + "</p>", {
              //       maxWidth : 560
              //   })
              //  )


            // }

            tornado_bubbles.push(
                L.circle([lat,lng], {
                    stroke: false,
                    fillOpacity: 0.8,
                    fillColor: circleColor(x.properties.mag),
                    radius: circleSize(x.properties.mag)
                }).bindPopup(
                    "<h5> State: " + x.properties.st + "</h5>" +
                    "<hr><p>" + x.properties.Date_Calc + "</p>", {
                    maxWidth : 560
                })
            )
        });
      }
      catch (err)
      {
        console.log(err);
      }

    // Create a layer out of the circles
    var tornadoLayer = L.layerGroup(tornado_bubbles);

    // Define layers

    var gray = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
  });

    var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });


    var baseMaps = {
        "Street Map": street,
        "Gray Map": gray    
   
    };

    // var tornadoPath = L.geoJson(filteredData);

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Tornado Bubbles": tornadoLayer
      // "Tornados Path": tornadoPath
      };

   // check the "map" id element for existing initialization
    // if contains stuff, then clean it first before initing myMap
    var container = L.DomUtil.get('map');
    if(container != null){
      container._leaflet_id = null;
    }
    
    // Remove the existing map
    if (typeof myMap !== 'undefined' && myMap) {
      myMap.off();
      myMap.remove();
      console.log("myMap removed....");
    }

    // Creating map object
    var myMap = L.map("map", {
        center: [32.8283, -98.5795],
        zoom: 4.46,
        // layers: [street, tornadoLayer, tornadoPath],
        layers: [street, tornadoLayer]

      });

      // Create a layer control
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

      // Create a legend to display information about our map
      var info = L.control({
        position: "topright"
      });

      // When the layer control is added, insert a div with the class of "legend"
      info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML=[
              "<h5>Magnitude</h5>",
              "<i class='TornadoMag_0'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;< 0<br>",
              "<i class='TornadoMag_1'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;1<br>",
              "<i class='TornadoMag_2'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;2<br>",
              "<i class='TornadoMag_3'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;3<br>",
              "<i class='TornadoMag_4'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;4<br>",
              "<i class='TornadoMag_5'>&nbsp;&nbsp;&nbsp&nbsp;</i>&nbsp;&nbsp;5<br>"

              

          ].join("");

          return div;
      };     
      // Add the info legend to the map
      info.addTo(myMap);       

} // ends function createFeature()




    
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
  d3.select("#year")
    .selectAll("option")
    .data(yrValues)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    })
    // .on("change", function() {
      // var year = d3.select(this).property("value");
      // createFeatures(data, year);
    // });

  // Call function createBubbleChart with the initial selected year
  // createBubbleChart(yrValues[0], data);
  
}


// this function is called when a changed in the drop-down selection occurs.
// that is, user select a new year value
function optionChanged(year)
{
    console.log("change year to " + year);
    // alert("selecting year: " + year);

    d3.json(sample)
    .then(function(data) {
      console.log(data);

      // call creteBubbleChart passing it state and data

      createFeatures(data, year);

    })
    .catch(function(error) {
      console.error(error);
    });

}
    
//Function to determine circle size
function circleSize(mag) {

  // need to handle case where mag <= 0
  // map will show lines, looks ugly
  if (mag <= 0)
    return 10000;
  else
    return mag * 30000;

}

//Function to determine circle size
function circleColor(magnitude) {
  var color="";
  switch(true) {

      case (magnitude < 1):
          color="#faf4e3";
          break;
      case (magnitude == 1):
          color="#FFEDA0";
          break;
      case (magnitude == 2):
          color="#FEB24C";
          break;
      case (magnitude == 3):
          color="#FD8D3C";
          break;
      case (magnitude == 4):
          color="#E31A1C";
          break;
      case (magnitude == 5):
          color="#BD0026";
          break;

  }
  return color;
}
