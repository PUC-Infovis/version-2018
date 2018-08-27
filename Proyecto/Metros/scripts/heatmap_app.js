/*
Copyright (c) 2016, Nebil Kawas García
This source code is subject to the terms of the Mozilla Public License.
You can obtain a copy of the MPL at <https://www.mozilla.org/MPL/2.0/>.

snippet05.js -- Ejemplo: mapa de Santiago
*/

// Intentaremos construir algo (un poco) más interesante que un _bar chart_.
// Usaremos D3 para presentar información demográfica sobre nuestra capital.
// set the dimensions and margins of the graph



var HEIGHT = 900,
    WIDTH = window.innerWidth * .95;

var MAPWIDTH = 800,
    MAPHEIGHT = 800;

var margin = {top: 70, right: 40, bottom: 70, left: 40},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var marginSM = {top:30, right: 30, bottom: 30, left:30},
    widthSM = 400 - margin.left - margin.right,
    heightSM = 200 - margin.left - margin.right;

var FP = 'data/santiago.geojson';
var FP2 = 'data/dow_data/dow-data.json'
var FP3 = 'data/dow_data/sectores_trips.json'
// var POINTS = 'data/data_Domingo.csv';

FPS = () => {
  fps = []
  day_of_week = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  day_of_week.forEach(dow =>{
    fileName = `data/dow_data/total_trips_${dow}.json`
    fps.push(fileName)
  })
  return fps
}
var FILEPATHS = FPS();
var COLORS = d3.schemeYlOrRd[6];

// Definamos algunos parámetros relacionados con la población.
var MINTRIPS =  100;
var MEDTRIPS = 3500;
var MAXTRIPS = 7000;
var PREFIX = 'https://es.wikipedia.org/wiki/';


d3.select('#d3-header').text("Provincia de Santiago");
d3.selectAll('#dow-container p').remove();

var body = d3.select('#dow-container');
// body.append('p')
//                 .attr('id', 'region')
//                 .style('font-weight', 'bold');

var container = body.append('svg')
                    .attr('width', WIDTH)
                    .attr('height', HEIGHT);

// var smallMultiples = body.append('g')
                        //  .attr('width', WIDTH)
                        //  .attr('height', HEIGHT + 100)
                        //  .attr('class', 'smallcontainer')
var smallMultiples = container.append('g')
                        .attr('transform', `translate(${WIDTH - widthSM - 100}, 0)`)
                        .attr('class', 'smallcontainer');

var barchartContainer = container.append('g')
                        .attr('transform', `translate(${width + 500}, 0)`)
                        .attr('class', 'barchartContainer');

function getMapParameters(bounds) {
    // Adaptado desde http://stackoverflow.com/a/14691788.

    // Obtenemos las coordenadas de ambos puntos: b0 y b1.
    // Estos puntos encuadran este mapa, en una caja.
    var [[b0x, b0y], [b1x, b1y]] = bounds; // (¡ES6!)

    // Luego, utilizamos estos puntos para hallar los parámetros adecuados.
    var scale = 0.95 / Math.max((b1x - b0x) / MAPWIDTH, (b1y - b0y) / MAPHEIGHT);
    var translate = [(MAPWIDTH - scale * (b1x + b0x)) / 2,
              -75 + (MAPHEIGHT - scale * (b1y + b0y)) / 2];
    return [scale, translate];
}

const updateDay = newDataset => {
  // Obtengamos los datos desde el archivo en formato JSON.
  d3.json(FP, function(json) {
      // Antes de dibujar un mapa, debemos primero escoger una proyección,
      // ya que no es posible representar —sin provocar alguna distorsión—
      // nuestro magnífico y esférico planeta Tierra      (tridimensional)
      // en la plana superficie de nuestro navegador.      (bidimensional)
      // (Más información en: https://www.youtube.com/watch?v=kIID5FDi2JQ)
      // console.log(json);
      d3.json(newDataset, json2 => {
        let total_trips = Object.values(json2).reduce((a, b) => a + b, 0);
        let comune_name = Object.keys(json2);
        let comune_total = Object.keys(json2).length;

        console.log(total_trips, comune_total ,comune_name );

        var colorScale = d3.scaleLinear()
                          .domain([MINTRIPS, 1380, 2760, 4140, 5520, MAXTRIPS])
                          .range(COLORS);

        // En este caso, usaremos la proyección de Gerardus Mercator.
        var projection = d3.geoMercator().scale(1).translate([0, 0]);
        var path = d3.geoPath().projection(projection);

        // Busquemos parámetros apropiados de 'scale' y 'translate'.
        var [s, t] = getMapParameters(path.bounds(json)); // (¡ES6!)

        // Luego, actualicémoslos en la proyección.
        projection.scale(s).translate(t);
        container.selectAll('path').remove().exit()

        // Hagamos, finalmente, entrar a los datos.
        container.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .on('mouseover', (d, i, e) => createBarChart(d))
            .on('mouseout', (d) => removeBarChart(d))
            .transition()
            .attr('d', path)
            .attr('fill', datum => {
                return colorScale(getTripsComuna(datum, json2));
              })
        })
  });
}

const updateHist = nameComuna => {
  // Agrego aca el barchart de manera que no tape al small multiple
  var barchart = barchartContainer.append('g')
                     .attr('class', 'barchart')
                     .attr("transform", `translate(${margin.left},${margin.top})`)

  d3.json(FP2, data => {
    let dowData = [];
    let dows = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado',
                'domingo']
    dows.forEach(dow => {
      dowData.push({
        'dow': dow.charAt(0).toUpperCase() + dow.slice(1),
        'trips': data[dow][nameComuna]
      })
    })

    let dow_formated = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado',
                'Domingo']

    let xBarChart = d3.scaleBand().rangeRound([0, width])
                                  .domain(dow_formated)
                                  .padding(0.1),
        yBarChart = d3.scaleLinear().range([height ,0])
                                    .domain([0, d3.max(dowData, d => {return +d.trips})])  ;

    // console.log(yBarChart(200));
    barchart.selectAll('.bar')
             .data(dowData).enter()
             .append('rect')
             .attr('class', 'bar')
             .attr('x', d=>{ return xBarChart(d.dow)})
             .attr('y', d=> {return yBarChart(d.trips)})
             .attr('width', xBarChart.bandwidth() - 10)
             .attr('height', d => {return height - yBarChart(d.trips)})
             .attr('fill', "#fd8d3c")

    barchart.append('g')
             .attr("class", "barchart axis axis--x")
             .attr("transform", "translate(0,"+ height +")")
             .call(d3.axisBottom(xBarChart));

    barchart.append("g")
       .attr("class", "barchart axis axis--y")
       .call(d3.axisLeft(yBarChart))
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("dy", "0.71em")
       .attr("text-anchor", "end")
       .text("Frequency");

    d3.select('g.barchart')
        .append("text")
        .attr("class", "barchart title")
        .attr("y", margin.top - 80)
        .attr("x", (width / 2) - margin.left)
        .text(nameComuna)

  });
}

const updateMultiples = (filepath) => {

  let dow_formated = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado',
              'Domingo']

  let marginItemSM = {top:10, right: 10, bottom: 10, left:10},
      widthItemSM = 350 - marginItemSM.left - marginItemSM.right,
      heightItemSM = 110 - marginItemSM.left - marginItemSM.right;

  d3.json(filepath, data => {

      let sectoresNames = Object.keys(data);
      let trips = Object.keys(data).map(sector => {return data[sector]});
      let max_trips = d3.max(trips.map(sector => {return Object.values(sector)}), array => {return d3.max(array)});

    // Creo un grafico por cada sector
    sectoresNames.forEach((sector, i) => {
      let dowData = [];
      let dows = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado',
                  'domingo']
      dows.forEach(dow => {
        dowData.push({
          'dow': dow.charAt(0).toUpperCase() + dow.slice(1),
          'trips': data[sector][dow]
        })
      })

      console.log(dowData);
      var grafico = smallMultiples.append('g')
                    .attr('class', `multiple item ${sector}`)
                    .attr('transform', `translate(${marginItemSM.left}, ${i*130 + marginItemSM.top})`)

      var dataArray = Object.values(data[sector])

      let xScale = d3.scaleBand().rangeRound([0, widthItemSM])
                                    .domain(dow_formated)
                                    .padding(0.1),
          yScale = d3.scaleLinear().range([heightItemSM ,0])
                                   .domain([0, max_trips]);

      let area = d3.area()
                   .x(d => {return xScale(d.dow)})
                   .y1(d => {return yScale(+d.trips)})

      area.y0(yScale(0));

      grafico.append('path')
             .datum(dowData)
             .attr('fill', '#fd8d3c')
             .attr('d', area)

      grafico.append('g')
            .attr("transform", "translate(0," + heightItemSM + ")")
            .call(d3.axisBottom(xScale));

      grafico.append('g')
              .call(d3.axisLeft(yScale).ticks(5, 's'))
             .append('text')
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")

      grafico.append("text")
      .attr("class", "multiple title")
      .attr("y", marginItemSM.top - 10)
      .attr("x", (widthItemSM / 2) - 30)
      .text(sector.charAt(0).toUpperCase() + sector.slice(1))

    })

  })
}

updateDay(FILEPATHS[0]);
updateMultiples(FP3);

d3.select('#dow-selector').on('change', () => {
    var base_path = 'data/dow_data/'
    var dow = {'0': 'lunes', '1': 'martes', '2': 'miercoles', '3': 'jueves',
              '4': 'viernes', '5': 'sabado', '6': 'domingo'};
    var dataset = base_path + 'total_trips_' +
                  dow[d3.select('#dow-selector').property('value')] +
                  '.json';

    console.log(dataset);
    updateDay(dataset);
    });

function removeBarChart(datum){
  // d3.select("g.barchart").selectAll("*").remove();
  d3.select("g.barchart").remove();
  updateMultiples(FP3)
}

function createBarChart(datum) {
    d3.selectAll('g.multiple').remove();
    // d3.selectAll("multiple.item").remove();
    var name = datum.properties.NAME;
    updateHist(name)
}

function getWiki(datum) {
    return PREFIX + datum.properties.WIKI;
}

function getPopulation(datum) {
    return datum.properties.POP;
}

function getTripsComuna(datum, dataset) {
  var name = datum.properties.NAME;
  // console.log(name + " "+  dataset[name]);
  return dataset[name];
}
