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

  // Call function createBubbleChart with the initial selected state
  createBubbleChart(yrValues[0], data);
  
}

function optionChanged(year)
{
    console.log("change year to " + year);

    d3.json(sample)
    .then(function(data) {
      console.log(data);
    
      // call creteBubbleChart passing it state and data
    createBubbleChart(year, data);

    })
    .catch(function(error) {
      console.error(error);
    });

}


function createBubbleChart(year, data) {

    //console.log(data);
    
    console.log(year);

   // alert("createBubbleChart called with state =  " + selectedState);

  // Filter the data based on the selected state
  // let value =     data.samples.filter(result => result.id == subjectID);  this is from previous project
  var filteredData = data.features.filter(feature => feature.properties.yr == year);

    //console.log(filteredData.length);
    console.log(filteredData);
  //console.log(filteredData[0].properties.mag);

  let lenVal = [];   //magnitude value
  //let widVal = [];   //injuriesvalue
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
    //widVal.push(filteredData[i].properties.inj);

    //console.log(filteredData[i].properties.inj);
    markSize.push(Math.log(filteredData[i].properties.inj)*10); // normalize those injury numbers a little bit
    
    magVal.push(filteredData[i].properties.mag*10);

    cityLat.push(filteredData[i].properties.slat);
    cityLon.push(filteredData[i].properties.slon);

    displayText = ``
    hoverText.push()
  }

  /*
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.log(lenVal);
  console.log(widVal);
  console.log(markSize);
  console.log(magVal);
  */

  


  var trace2 = [{
    type: 'scattergeo',
    locationmode: 'USA-states',
    lat: cityLat,
    lon: cityLon,
    hoverinfo: 'text',
    text: hoverText,
    marker: {
        size: markSize, // This version currently bases mark size on number of injured
        line: {
            color: 'black',
            width: 2
        },
    }
}];


var layout = {
  title: 'Tornados in the USA',
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