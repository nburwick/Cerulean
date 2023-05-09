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

  // Access the "st" values and remove duplicates
  var stValues = [...new Set(features.map(feature => feature.properties.st))];

  // Sort the "st" values in ascending order
  stValues.sort(function(a, b) {
    return d3.ascending(a, b);
  });

  // Create the dropdown options
  d3.select("#states")
    .selectAll("option")
    .data(stValues)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    })
    .on("change", function() {
      var selectedState = d3.select(this).property("value");
      createBubbleChart(selectedState, data);
    });

  // Call function createBubbleChart with the initial selected state
  createBubbleChart(stValues[0], data);
  
}

function optionChanged(state)
{
    console.log("change state to " + state);

    d3.json(sample)
    .then(function(data) {
      console.log(data);
    
      // call creteBubbleChart passing it state and data
    createBubbleChart(state, data);

    })
    .catch(function(error) {
      console.error(error);
    });

}


function createBubbleChart(selectedState, data) {

    console.log(data);
    
    console.log(selectedState);

   // alert("createBubbleChart called with state =  " + selectedState);

  // Filter the data based on the selected state
  // let value =     data.samples.filter(result => result.id == subjectID);  this is from previous project
  var filteredData = data.features.filter(feature => feature.properties.st === selectedState);

    console.log(filteredData.length);
    console.log(filteredData);
  //console.log(filteredData[0].properties.mag);

  let lenVal = [];   //magnitude value
  let widVal = [];   //injuriesvalue
  let magVal = [];   // magnitude
  let markSize = []; // injuries

  let cityLat = [];
  let cityLon = [];

  let hoverText = [];

  for (i = 0; i < filteredData.length; i++)
  {
    //console.log(filteredData[i].properties.slat);
    lenVal.push(filteredData[i].properties.mag);

    //console.log(filteredData[i].properties.slon);
    widVal.push(filteredData[i].properties.inj);

    //console.log(filteredData[i].properties.inj);
    markSize.push(filteredData[i].properties.inj);
    
    magVal.push(filteredData[i].properties.mag);

    cityLat.push(filteredData[i].properties.slat);
    cityLon.push(filteredData[i].properties.slon);




  }
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.log(lenVal);
  console.log(widVal);
  console.log(markSize);
  console.log(magVal);
  

  


  var trace2 = [{
    type: 'scattergeo',
    locationmode: 'USA-states',
    lat: cityLat,
    lon: cityLon,
    hoverinfo: 'text',
    text: hoverText,
    marker: {
        size: markSize,
        line: {
            color: 'black',
            width: 2
        },
    }
}];


var layout = {
  title: 'Tornado in the USA',
  showlegend: false,
  geo: {
      scope: 'usa',
      projection: {
          type: 'albers usa'
      },
      showland: true,
      landcolor: 'rgb(217, 217, 217)',
      subunitwidth: 1,
      countrywidth: 1,
      subunitcolor: 'rgb(255,255,255)',
      countrycolor: 'rgb(255,255,255)'
  },

};

Plotly.newPlot("bubble", trace2, layout, {showLink: false});

}

function printConsole()
{
    console.log("What's up doc?")
}