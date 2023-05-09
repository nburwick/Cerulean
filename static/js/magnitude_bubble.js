/*
Ideally, this'll make a cool bubble chart using Leaflet where you can filter the bubbles shown with a dropdown menu of magnitudes.

I want to use these kinds of functions:
    build a bubble chart, takes in a list of geojson entries as a parameter

    initialize bubble chart, takes in no parameters but calls the "build a bubble chart" function.

    option changed, overwrite the current bubble chart with a new one with filtered data based on what has changed in the drop down menu
        will probably be finicky with multiple drop downs?
        maybe uses a text box input instead? but that's more likely to give me trouble


function bubbleChart(features)
{
    var myMap = L.map("bubble",
        {
        center: [37.0902, -95.7129], // replace this with the geographic center of the US
        zoom: 4
        }
    )
}
*/

// Initialize an empty map.
var myMap = L.map("map",
    {
    center: [37.0902, -95.7129],
    zoom: 4
    }
)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json("static/Resources/Tornado_Tracks.geojson").then(function(data) {
    console.log(data.features[0].geometry.coordinates)
})