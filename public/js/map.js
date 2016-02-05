$(document).ready(function() {
  if ($('#map').length === 0) {
    return;
  }

  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhamhhcnJpcyIsImEiOiJjaWs4aXY4OTUwMnM4dTNrdzc0NDI3Mm1yIn0.2qKe8jSYKFlGRiApo2ZiVw';
  // var map = new mapboxgl.Map({
  //     container: 'map', // container id
  //     style: 'mapbox://styles/joshuajharris/cik8qfu0o00l596kpqfm842yi', //stylesheet location
  //     center: [-77.03238901390978, 38.913188059745586], // starting position
  //     zoom: 18, // starting zoom
  //     pitch: 75
  // });

var features = [];
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  var html = $('body>#marker-template').html();
  var markerTemp = _.template(html);
  $('#event').each(function(i, event) {
    var marker = {
      name: $(event).children('input[name=name]').val(),
      description: $(event).children('input[name=description]').val(),
      lat: $(event).children('input[name=lat]').val(),
      long: $(event).children('input[name=long]').val()
    };
    // var lat = $(event).children('input[name=lat]').val();
    // var long = $(event).children('input[name=long]').val();
    var feature = {
        "type": "Feature",
        "properties": {
            "description": markerTemp(marker),
            "marker-symbol": "restaurant"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [marker.lat, marker.long]
        }
    };
    features.push(feature);
  });

  var markers = {
      "type": "FeatureCollection",
      "features": features
  };

  var map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/streets-v8',
      style: 'mapbox://styles/joshuajharris/cik91dyhk000f9fm1aogokton',
      // center: [-77.020945, 38.878241],
      center: [-77.03238901390978, 38.913188059745586],
      zoom: 18, // starting zoom
      pitch: 60
  });

  map.on('style.load', function () {
      // Add marker data as a new GeoJSON source.
      map.addSource("markers", {
          "type": "geojson",
          "data": markers
      });

      // Add a layer showing the markers.
      map.addLayer({
          "id": "markers",
          "interactive": true,
          "type": "symbol",
          "source": "markers",
          "layout": {
              "icon-image": "{marker-symbol}-15"
          }
      });
  });

  // When a click event occurs near a marker icon, open a popup at the location of
  // the feature, with description HTML from its properties.
  map.on('click', function (e) {
      map.featuresAt(e.point, {layer: 'markers', radius: 10, includeGeometry: true}, function (err, features) {
          if (err || !features.length)
              return;

          var feature = features[0];

          new mapboxgl.Popup()
              .setLngLat(feature.geometry.coordinates)
              .setHTML(feature.properties.description)
              .addTo(map);
      });
  });

  // Use the same approach as above to indicate that the symbols are clickable
  // by changing the cursor style to 'pointer'.
  map.on('mousemove', function (e) {
      map.featuresAt(e.point, {layer: 'markers', radius: 10}, function (err, features) {
          map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
      });
  });

  map.on('click', function(e) {
    console.log(e.lngLat);
  });
});
