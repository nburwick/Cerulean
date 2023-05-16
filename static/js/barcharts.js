// Load the GeoJSON file
function fatalities(){
  var state = document.getElementById('states').value
  d3.json(update_api(state)).then(function(data) {
  // Extract the features from the GeoJSON data
  

  var features = data.features;
  // if(state != "all"){features = features.filter(feature => feature.properties.st == state)}

  // Group the features by year and calculate the sum of fatalities for each year
  var fatalitiesData = d3.rollups(
    features,
    function(v) {
      return d3.sum(v, function(feature) {
        return feature.properties.fat;
      });
    },
    function(feature) {
      return feature.properties.yr;
    }
  );

  // Extract the years and fatalities data
  var years = fatalitiesData.map(function(d) {
    return d[0];
  });

  var fatalities = fatalitiesData.map(function(d) {
    return d[1];
  });

  // Create the bar chart (Fatalities)
  var traceFatalities = {
    x: years,
    y: fatalities,
    type: "bar",
    marker: {
      color: fatalities,
      colorscale: "Portland",
      cmin: 0,
      cmax: Math.max(...fatalities),
      colorbar: {
        title: "Fatalities",
      },
    },
    hovertemplate: "Year: %{x}<br>Total Fatalities: %{y}<extra></extra>",
  };

  var dataFatalities = [traceFatalities];

  var layoutFatalities = {
    title: "Fatalities in the U.S. Due to Tornadoes",
    xaxis: {
      title: "Year",
      automargin: true,
    },
    yaxis: {
      title: "Fatalities",
    },
  };
  
  // Plot the Fatalities bar chart
  Plotly.newPlot("barcharts", dataFatalities, layoutFatalities);
})};


// Load the geoJSON file
function magnitude(state){
  // Extract the properties from the geoJSON features
  var state = document.getElementById('states').value
  d3.json(update_api(state)).then(function(data) {
  // Extract the properties from the geoJSON features

  var features = data.features;
  // if(state != "all"){features = features.filter(feature => feature.properties.st == state)}

  // Extract the years and magnitudes from the features
  var years = features.map(function(feature) {
    return feature.properties.yr;
  });
  
  var magnitudes = features.map(function(feature) {
    return feature.properties.mag === -9 ? null : feature.properties.mag;
  });

  // Filter out null magnitudes
  var filteredMagnitudes = magnitudes.filter(function(magnitude) {
    return magnitude !== null;
  });

  // Calculate the average magnitude for each year
  var averageMagnitudes = d3.rollup(
    filteredMagnitudes,
    function(v) {
      return d3.mean(v);
    },
    function(_, i) {
      return years[i];
    }
  );

  // Convert the rollup map to an array of objects
  var averageMagnitudeData = Array.from(averageMagnitudes, function([year, magnitude]) {
    return { year: year, magnitude: magnitude };
  });

  // Sort the data by year in ascending order
  averageMagnitudeData.sort(function(a, b) {
    return a.year - b.year;
  });

  // Extract the years and magnitudes for plotting
  var yearsForPlot = averageMagnitudeData.map(function(d) {
    return d.year;
  });
  var magnitudesForPlot = averageMagnitudeData.map(function(d) {
    return d.magnitude;
  });

  // Create the bar chart
  var data = [
    {
      x: yearsForPlot,
      y: magnitudesForPlot,
      type: 'bar',
      marker: {
        color: magnitudesForPlot,
        colorscale: 'Viridis',
        cmin: d3.min(magnitudesForPlot),
        cmax: d3.max(magnitudesForPlot),
        colorbar: {
          title: 'Magnitude',
          tickmode: 'array',
          tickvals: [d3.min(magnitudesForPlot), d3.max(magnitudesForPlot)],
          ticktext: [d3.min(magnitudesForPlot).toFixed(2), d3.max(magnitudesForPlot).toFixed(2)],
          len: 0.5,
          y: 0.5,
        },
      },
    },
  ];

  var layout = {
    title: 'Average Magnitude of Tornadoes in the U.S.',
    xaxis: {
      title: 'Year',
      automargin: true,
    },
    yaxis: {
      title: 'Magnitude',
    },
  };

  Plotly.newPlot('barcharts', data, layout);
})};


// Load the geoJSON file
function propertyLoss(state){
  var state = document.getElementById('states').value
  d3.json(update_api(state)).then(function(data) {
    // Extract the properties from the geoJSON features

    var features = data.features;
    // if(state != "all"){features = features.filter(feature => feature.properties.st == state)}
  
    // Categorize the property loss values
    features.forEach(function(feature) {
      var loss = feature.properties.loss;
      if (feature.properties.yr < 1996) {
        if (loss === "" || loss === "0") {
          feature.properties.lossCategory = "Unknown";
        } else if (loss < 50) {
          feature.properties.lossCategory = "< $50";
        } else if (loss >= 50 && loss < 500) {
          feature.properties.lossCategory = "$50-$500";
        } else if (loss >= 500 && loss < 5000) {
          feature.properties.lossCategory = "$500-$5000";
        } else if (loss >= 5000 && loss < 50000) {
          feature.properties.lossCategory = "$5000-$50000";
        } else if (loss >= 50000 && loss < 500000) {
          feature.properties.lossCategory = "$50000-$500000";
        } else if (loss >= 500000 && loss < 5000000) {
          feature.properties.lossCategory = "$500000-$5000000";
        } else if (loss >= 5000000 && loss < 50000000) {
          feature.properties.lossCategory = "$5000000-$50000000";
        } else if (loss >= 50000000 && loss < 500000000) {
          feature.properties.lossCategory = "$50000000-$500000000";
        } else {
          feature.properties.lossCategory = "> $5000000000";
        }
      } else {
        feature.properties.lossCategory = "$" + (loss * 1000000).toLocaleString();
      }
    });
  
    // Calculate the total property loss for each year (1950-1995)
    var propertyLoss1950to1995 = d3.rollup(
      features.filter(function(feature) {
        return feature.properties.yr >= 1950 && feature.properties.yr < 1996;
      }),
      function(v) {
        return d3.sum(v, function(feature) {
          return feature.properties.loss;
        });
      },
      function(feature) {
        return feature.properties.yr;
      }
    );
  
    // Calculate the total property loss for each year (1996-2022)
    var propertyLoss1996to2022 = d3.rollup(
      features.filter(function(feature) {
        return feature.properties.yr >= 1996 && feature.properties.yr <= 2022;
      }),
      function(v) {
        return d3.sum(v, function(feature) {
          return feature.properties.loss;
        });
      },
      function(feature) {
        return feature.properties.yr;
      }
    );
  
    // Convert the rollup maps to arrays of objects
    var propertyLossData1950to1995 = Array.from(propertyLoss1950to1995, function([year, loss]) {
      return { year: year, loss: loss };
    });
  
    var propertyLossData1996to2022 = Array.from(propertyLoss1996to2022, function([year, loss]) {
      return { year: year, loss: loss };
    });
  
    // Sort the data by year in ascending order
    propertyLossData1950to1995.sort(function(a, b) {
      return a.year - b.year;
    });
  
    propertyLossData1996to2022.sort(function(a, b) {
      return a.year - b.year;
    });
  
    // Extract the years and property loss values (1950-1995)
var years1950to1995 = propertyLossData1950to1995.map(function(data) {
    return data.year;
  });
  
  var propertyLossValues1950to1995 = propertyLossData1950to1995.map(function(data) {
    return data.loss;
  });
  
  // Extract the years and property loss values (1996-2022)
  var years1996to2022 = propertyLossData1996to2022.map(function(data) {
    return data.year;
  });
  
  var propertyLossValues1996to2022 = propertyLossData1996to2022.map(function(data) {
    return data.loss;
  });
  
// Create the bar chart (1950-1995)
var trace1950to1995 = {
  x: years1950to1995,
  y: propertyLossValues1950to1995,
  type: "bar",
  name: 'Property Loss (1950-1995)',
  marker: {
    color: "rgba(54, 162, 235, 0.5)",
  },
  hovertemplate: "%{y}<extra></extra>",
};

// Create the bar chart (1996-2022)
var trace1996to2022 = {
  x: years1996to2022,
  y: propertyLossValues1996to2022,
  type: "bar",
  name: 'Property Loss (1996-2022)',
  marker: {
    color: "rgba(75, 192, 192, 0.5)",
  },
  hovertemplate: "%{y}<extra></extra>",
};

var data = [trace1950to1995, trace1996to2022];
trace1996to2022.visible = false; // Hide the trace initially

var layout = {
  title: {
    text: "Property Loss in the U.S. Due to Tornadoes",
  },
  xaxis: {
    title: "Year",
    automargin: true,
  },
  yaxis: {
    title: "Property Loss",
    tickprefix: "$",
    showticklabels: true,  // To prevent hiding the y-axis label
  },
  updatemenus: [
    {
      buttons: [
        {
          method: "restyle",
          args: ["visible", [true, false]], // Show "trace1950to1995", hide "trace1996to2022"
          label: "1950-1995",
        },
        {
          method: "restyle",
          args: ["visible", [false, true]], // Show "trace1996to2022", hide "trace1950to1995"
          label: "1996-2022",
        },
      ],
      direction: "down",
      showactive: true,
      active: 0,
      x: -0.07,
      y: 1,
    },
  ],
};

Plotly.newPlot("barcharts", data, layout);
})
}
fatalities();