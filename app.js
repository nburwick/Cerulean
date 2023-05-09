// Fetch the data from the URL using d3.json
const url = "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Tornado_Tracks_1950_2017_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

d3.json(url).then(data => {
  // Create a list of dictionaries
  var tornadoes = [];
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
  }

  console.log(tornadoes);

  let tornadoarray=[];
  for (var i=0; i<tornadoes.length; i++) {
    tornadoarray.push([tornadoes[i].slat,tornadoes[i].slon])
  };

  console.log(tornadoarray);


  // Extract latitudes and longitudes from the tornado data
  // var coordinates = tornadoes.map(function (tornado) {
  //   return [tornado.slat, tornado.slon];
  // });

  //console.log(coordinates);



  // Create a Leaflet map and add the heat map layer
  var myMap = L.map("map").setView([37.0902, -95.7129], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


 let heat = L.heatLayer(tornadoarray, {
  radius: 25,
  minOpacity : 0.2,
  gradient:{0.4:'blue', 0.5:'lime', 0.6:'red'}}).addTo(myMap);
  
  


  //_______________________MAKE CIRCLE____________________________

  // var heat = L.layerGroup().addTo(myMap);

  // coordinates.forEach(function(coord) {
  //   heat.addLayer(L.circle(coord, {  
  //     radius: 5,
  //     blur: 15,
  //     maxZoom: 17,
  //   }));
  // });

  //____________________________MAKE HEAT MAP_____________________________
  // var heatMapPoints = coordinates;
  // console.log(heatMapPoints);

  // var heat = L.heatLayer(heatMapPoints, {radius: 25 }).addTo(map);



  // var heat = L.heatLayer(coordinates, {
  //   radius: 25,
  //   gradient :{0.4:'blue', 0.65:'lime', 1:'red'}
  //   }).addTo(map);


  //   // Create a Leaflet map and add the density map layer
  //   var myMap = L.map("map").setView([37.0902, -95.7129], 4);

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   }).addTo(myMap);

  //   var markers = L.markerClusterGroup({
  //     spiderfyOnMaxZoom: false,
  //     showCoverageOnHover: false,
  //     zoomToBoundsOnClick: false
  //   });

  //   markers.addLayer(L.densityMarkerLayer({
  //     radius: 20,
  //     blur: 10,
  //     gradient: {
  //       0.4: 'blue',
  //       0.65: 'lime',
  //       1: 'red'
  //     },
  //     data: coordinates
  //   }));

  //   myMap.addLayer(markers);



});