

// Reviso si el punto esta en la comuna
d3.json(FILEPATH, function(json) {
  d3.csv(POINTS, function(d) {
    return {
      long : d.LONG,
      lat : d.LAT,
      date : d.DATE1,
      user_id : d.ID
    };
  }, function(err, data){
    var arrPoints = [];
    // var heatmapCount = {};
    // data.forEach(function(row){
    //   arrPoints.push([parseFloat(row.LONG), parseFloat(row.LAT)])
    // })
    console.log(arrPoints);

    json.features.forEach(function(feature){
      console.log(`Comuna ${feature.properties.NAME}`);
      // var count = 0;
      var pointArray = [];
      data.forEach( point => {

        if (d3.geoContains(feature, [point.long, point.lat]))
          // count += 1;
          point['Comuna'] = feature.properties.NAME;
          pointArray.push(point)
        })
      console.log(pointArray);
      // console.log(heatmapCount);
      // heatmapCount[feature.properties.NAME] = count;
      })
    console.log('Termine!');
    })
})
