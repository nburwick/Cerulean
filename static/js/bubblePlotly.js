// This version of the bubble map uses magnitude for bubble size and injury count for color.

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
      createBubbleChart(year, data);
    });

  // Call function createBubbleChart with the initial selected year
  createBubbleChart(yrValues[0], data);
  
}

function optionChanged(year)
{
    console.log("change year to " + year);

    d3.json(sample)
    .then(function(data) {
      console.log(data);
    
      // call creteBubbleChart passing year and data
    createBubbleChart(year, data);

    })
    .catch(function(error) {
      console.error(error);
    });

}

function createBubbleChart(year, data) {

    //console.log(data);
    console.log(year);

  // Filter the data based on the selected year
  var filteredData = data.features.filter(feature => feature.properties.yr == year);

    //console.log(filteredData.length);
    console.log(filteredData);

  
  let magVal = [];   
  let markSize = []; 

  let cityLat = [];
  let cityLon = [];

  let hoverText = [];

  let injVal = [];

  for (i = 0; i < filteredData.length; i++)
  {
    //console.log(filteredData[i].properties.inj);
    markSize.push(scaleInjuryCount(filteredData[i].properties.inj)); // normalize those injury numbers a little bit
    
    injVal.push(filteredData[i].properties.inj);

    magVal.push(filteredData[i].properties.mag*5); // just to make the markers more visible

    cityLat.push(filteredData[i].properties.slat);
    cityLon.push(filteredData[i].properties.slon);
    scale = 50000;
    displayText = ``
    hoverText.push("Injuries: " + filteredData[i].properties.inj)
  }

  var trace2 = [{
    type: 'scattergeo',
    locationmode: 'USA-states',
    lat: cityLat,
    lon: cityLon,
    hoverinfo: 'text',
    text: hoverText,
    mode: 'markers',
    marker: {
        opacity: [1, 0.8, 0.6, 0.4],
        size: magVal, // This version currently bases mark size on tornado magnitude
        sizemode: 'diameter',
        sizeref: 1,
        color: injVal,
        colorscale: "Plasma",

        line: {
            color: 'black',
            width: 1
        },
    }
}];

var layout = {
  title: 'Tornados in the USA - Year ' + year,
  showlegend: false,
  geo: {
      scope: 'usa',
      projection: {
          type: 'albers usa'
      },
      showland: true,
      landcolor: 'rgb(141, 238, 180)',
      subunitwidth: 1,
      countrywidth: 1,
      subunitcolor: 'rgb(255,255,255)',
      countrycolor: 'rgb(255,255,255)'
  },

};

Plotly.newPlot("bubble", trace2, layout, {showLink: false});

}

// assumes the original injury count min = 0 and max = 1000, scale it to somewhere between 5 and 100
function scaleInjuryCount(x)
{
  return ((100-5)*x)/1000+5
}