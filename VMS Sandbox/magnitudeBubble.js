// make the map with the defaults. It'll just be a basic street map over the United States
var myMap = L.map("map",
    {
    center: [37.0902, -95.7129],
    zoom: 4
    }
)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// access the json with D3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    var earthquakeData = data.features;

    // loop through every feature in the json
    for(i = 0; i<earthquakeData.length;i++)
    {
        //console.log(earthquakeData[i])
        // don't need that anymore

        //create a bubble for each feature
        L.circle(
            [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]],
            {
                color: bubbleColor(earthquakeData[i].geometry.coordinates[2]),
                fillColor: bubbleColor(earthquakeData[i].geometry.coordinates[2]),
                fillOpacity: 0.5,
                radius: bubbleSize(earthquakeData[i].properties.mag)
            }
        )
        //label each bubble nicely
        .bindPopup(
            `<center>${earthquakeData[i].properties.place}<hr>${new Date(earthquakeData[i].properties.time)}</center>`
        )
        .addTo(myMap)
    } 
    }
)

function bubbleSize(magnitude)
{
    return magnitude *25000 //adjust this as needed so that the bubbles look cool
}

function bubbleColor(depth)
/* what I want the colors to be:
depth : color
-10-10 : green
10-30 : yellow-green
30-50 : yellow
50-70 : orange
70-90 : red-orange
90+ : red
*/
{
    if (depth < 10)
    {
        return "green";
    } else if (depth < 30)
    {
        return "greenyellow";
    } else if (depth < 50)
    {
        return "yellow";
    } else if (depth < 70)
    {
        return "orange";
    } else if (depth < 90)
    {
        return "orangered";
    } else 
    {
        return "darkred";
    }
}
