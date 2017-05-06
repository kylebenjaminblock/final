/* =====================
  Set up the map
===================== */

var map = L.map('map', {
  center: [31.610001, 64.374550],
  zoom: 8
});

var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

var cartoUserName = 'kylebenjaminblock';

var myLayer;
// var infowindowTemplate ='<div class="cartodb-popup v2">'

/// Load all points upon landing on site
var districts = cartodb.createLayer(map, {
  user_name: cartoUserName,
  type: 'cartodb',
  interactivity: true,
  sublayers: [
    {
      sql: "SELECT * FROM helmand_data_js_1",
      cartocss: '#layer { marker-width: 7; marker-fill: #bc974a; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1;marker-placement: point; marker-type: ellipse; marker-allow-overlap: true;}',
      interactivity: ['wave','villagename','noedupercent','meanhhsize','unemployedpercent','btw10_15k' ], /// Define properties you want to be available on interaction ERROR unexpected identifier
    }
  ]
}).addTo(map)
  .on('done', function(layer) {
    myLayer = layer;
    // Set interactivity
    layer.setInteraction(true);
    /// add infowindow
    cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['wave','villagename','noedupercent','meanhhsize','unemployedpercent','btw10_15k'], {
          // infowindowTemplate: infowindowTemplate,
          // templateType: 'mustache',
        })
    console.log(layer)
    // Set up event
    layer.on('featureClick',function(e, latlng, pos, data) {
      console.log(data);
    });
  });
  console.log(districts)

/// Define change function where new user-specified layer is added to map

var changeWave = function(waveValue){
  console.log($('#wave-select').val(), $('#client-select').val())
  cartodb.createLayer(map, {
    user_name: cartoUserName,
    type: 'cartodb',
    interactivity: true,
    sublayers: [
      {
        sql: "SELECT * FROM helmand_data_js_1 WHERE wave = " + $('#wave-select'),
        cartocss: '#layer { marker-width: 7; marker-fill: #bc974a; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1;marker-placement: point; marker-type: ellipse; marker-allow-overlap: true;}',
        interactivity: ['noedupercent'], // Define properties you want to be available on interaction
    }
    ]
  }).addTo(map)
    .on('done', function(layer) {
      myLayer = layer;
      // Set interactivity
      layer.setInteraction(true);
      /// add infowindow
      cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['noedupercent'])
      console.log(layer)
      // Set up event
      layer.on('featureClick',function(e, latlng, pos, data) {
        console.log(data);
      });
    });
}

/// Execute change function that clears existing data and replaces with new layer

$( document ).ready(function(){
  $('#wave-select').change(function(e){
    var waveValue = $(this).val();
    // var clientValue =$(this).val(); /// CHECK
    map.removeLayer(myLayer);
    changeWave(waveValue);
    // changeWave(clientValue);
  })
})
