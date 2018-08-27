
const WIDTH = 600;
const HEIGHT = 300;
const MARGIN = { TOP: 0, BOTTOM: 40, LEFT: 50, RIGHT: 0 };
const PADDING = 50;
const MAX_RADIUS_BUBBLE = 40;

const width_bubble = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const height_bubble = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const FILEPATH_ANIME = './data/database.csv';

function makeCRCTable() {
	let c;
  let crcTable = [];
  for(let n = 0; n < 256; n++) {
    c = n;
    for(let k = 0; k < 8; k++) {
			c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		}
		crcTable[n] = c;
	}
	return crcTable;
}

function crc32(str) {
	let crcTable = window.crcTable || (window.crcTable = makeCRCTable());
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
  	crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}


const HASH_LENGTH = Math.pow(2, 20) - 1;

const container_bubble = d3.select('#container_bubble')
                    .append('svg')
                      .attr('width', WIDTH)
                      .attr('height', HEIGHT)
                    .append('g')
                      .attr('transform',
                            `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

var animes;

d3.text(FILEPATH_ANIME, function(error, text) {
  var psv = d3.dsvFormat(";");
  animes = psv.parse(text)

});


d3.select('#eje_x').property('value', 'aired');
d3.select('#eje_y').property('value', 'score');

var xscale = d3.scaleTime().range([PADDING, width_bubble - PADDING]);
var yscale = d3.scaleLinear().range([height_bubble - PADDING, PADDING]);
var rscale = d3.scalePow().exponent(0.25).range([0, MAX_RADIUS_BUBBLE]);

var axisBottom = d3.axisBottom(xscale).tickPadding(10);
var axisLeft = d3.axisLeft(yscale).tickPadding(10);

const parseDate = d3.timeParse("%Y-%m-%d");

xscale.domain([parseDate("1990-01-01"), parseDate("2020-01-01")]);
yscale.domain([0, 10]);

const xAxis = container_bubble
                .append('g')
                .attr("class", "xaxis")                
                .attr('transform', `translate(0, ${height_bubble})`);

const yAxis = container_bubble.append('g');

container_bubble.append("g")
        .attr("transform", "translate(0," + height_bubble + ")")
        .attr("class", "axisRed");

container_bubble.append("text")
        .attr('class', "eje_x_label")
        .attr("y", height_bubble + 38)
        .attr("x", width_bubble / 2)
        .style("text-anchor", "middle")
        .style('fill', 'black')
        .text("Release Date");

container_bubble.append("text")
        .attr('class', "eje_y_label")
        .attr('y', 40)
        .attr("x", 5)
        .style("text-anchor", "middle")
        .style('fill', 'black')
        .text("Score");

xAxis.call(axisBottom);
yAxis.call(axisLeft);

function getHash(str) {
  return crc32(str) & HASH_LENGTH;
}

d3.select("#toooodo").style('display', 'none')
var svg2 = d3.select("#legend")
.append("svg")
.attr("width", 100)
.attr('height', 10)
    
var legend = svg2.append("g")
              .attr("class", "legend1")
              
let color = d3.scaleLinear()
  .domain([0, HASH_LENGTH])
  .range(['#FFCB37', '#860C94']);

const position = (eje, atributo, nodo) =>{
  if (eje == 'y') {
    if (atributo == "members") {return yscale(parseInt(nodo.members))}
    if (atributo == "episodes") {return yscale(parseInt(nodo.episodes))}
    if (atributo == "aired") {return d3.max([yscale(parseDate(nodo.publish)), 60])}
    if (atributo == "score") {return yscale(parseInt(nodo.score))}
  }

  if (atributo == "members") {return xscale(parseInt(nodo.members))}
  if (atributo == "episodes") {return xscale(parseInt(nodo.episodes))}
  if (atributo == "aired") {return d3.max([xscale(parseDate(nodo.publish)), 60])}
  if (atributo == "score") {return xscale(parseInt(nodo.score))}
}

var listas_id = [];
var dataset_final = [];
var studios =[];

const actualizar_bubble = lista => {

      lista.forEach(d => listas_id.push(d));
      dataset_final = animes.filter(d =>listas_id.includes(d.id));
      update(dataset_final);
      rscale.domain([0, d3.max(dataset_final, d => parseInt(d.members.replace(/,/g, "")))]);
      
			dataset_final.forEach(d=>{
        if (!studios.includes(d.studios)) {
          studios.push(d.studios);
        }
      })
      svg2.attr("height", studios.length*40);
      
      const updatingCircles = container_bubble.selectAll('circle')
          .data(dataset_final, d => d.id);

      const enteringCircles = updatingCircles.enter()
                .append('circle')
                .attr('class', 'bubble')
                .attr('cx', d => position('x', d3.select('#eje_x').property('value'), d))
                .attr('cy', d => position('y', d3.select('#eje_y').property('value'), d))
                  
      updatingCircles.merge(enteringCircles).transition()
             .duration(200)
             .attr('r', d => rscale(parseInt(d.members.replace(/,/g, ""))))

      enteringCircles.on('mouseover', (d, i, nodes) => {
            // Agregar contorno
            d3.select(nodes[i])
              .style('stroke', '#333')
              .style('stroke-width', '3px');

            d3.selectAll('.bubble')
              .filter(':not(:hover)')
              .style('fill-opacity', 0.5)
              .style('stroke-width', '0px');

            document.getElementById("image_anime").src="image/"+d3.format("05")(d.id)+".jpg";
            document.getElementById("anime").innerText  = "  " + d.name;
            document.getElementById("text_anime").innerHTML  =
			                " <b>Release Date: </b>" + d.aired + "<br>" +
                      "  <b>Chapters: </b>" + d.episodes+ "<br>" +
                      "  <b>Studio: </b>" + d.studios;
        })
        .on('mouseout', (d, i, nodes) => {
            d3.select(nodes[i])
              .style('stroke-width', '0px');

            d3.selectAll('.bubble')
              .style('fill-opacity', 1)
              .style('stroke-width', '2px');
          });


       enteringCircles
            .transition()
            .duration(200)
            .attr('fill', d => color(getHash(d.studios)))
            .style('stroke', '#333')
            .style('stroke-width', '2px')
            // .style('cursor', 'none')
            .attr('r', d => rscale(parseInt(d.members.replace(/,/g, ""))))

       updatingCircles.exit()
          .transition()
          .duration(200)
          .attr('r', 0)
          .remove();

				container_bubble.selectAll("circle").sort( (a, b) => {
		        return d3['descending'](parseInt(a.members.replace(/,/g, "")),
						 												parseInt(b.members.replace(/,/g, "")));
		    });

      
        legend.selectAll('rect')
              .data(studios)
              .enter()
              .append("rect")
              .attr("x", 30)
              .attr("y", function(d, i){ return (i) *  35;})
              .attr("width", 30)
              .attr("height", 30)
              .attr('fill', d => color(getHash(d)))

        legend.selectAll('text')
              .data(studios)
              .enter()
              .append("text")
              .attr("x", 65)
              .attr("y", function(d, i){ return (i) *  35 + 18  ;})
              .text(d=>d)
};

let dataset = undefined;
const getValue = phase => +d3.select(`#${phase}-input`).property('value');

d3.select('#clear').on('click', () => {
	container.selectAll('circle').style('stroke-width', 0.1)
  listas_id = [];
  actualizar_bubble([]);
  tbody.selectAll('tr').remove();
})

d3.select('#filter').on('click', () => {
  var busqueda = animes.filter(d => d["name"] == document.getElementById("anime_autocomplete_1").value)
  if (busqueda.length >= 1){
    actualizar_bubble([busqueda[0].id])
  }else{
    alert('No hubo resultados')
  }
});

var table = d3.select('table');  
var thead = table.append('thead')
var tbody = table.append('tbody')

var columns = ["name", "score", "episodes","studios"]

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

thead.append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text(d => d.capitalize());

  
var update = function(new_data) {
    var rows = tbody.selectAll('tr')
      .data(new_data, d=>d.id)
      .enter()
      .append('tr')

    var cells = rows.selectAll('td')
      .data(row => columns.map(column => {return {column: column, value: row[column]}}))
      .enter()
      .append('td')
      .text(d => d.value);

};
d3.select('#eje_x').on('change', () =>{
  selectValue = d3.select('#eje_x').property('value');
  if (selectValue == "aired") {
    xscale = d3.scaleTime().range([PADDING, width_bubble - PADDING]);       
    xscale.domain([parseDate("1990-01-01"), parseDate("2020-01-01")]);    
    container_bubble.select('.eje_x_label').text("Release Date")   
    
  }
  else if (selectValue == "score") {
    xscale = d3.scaleLinear().range([PADDING, width_bubble - PADDING]);   
    xscale.domain([0, 10]);    
    container_bubble.select('.eje_x_label').text("Score")   
    
  }

  else if (selectValue == "episodes") {
    xscale = d3.scaleLinear().range([PADDING, width_bubble - PADDING]);   
    if (dataset_final.length == 0) {xscale.domain([1, 13]);}
    else{xscale.domain([1, d3.max([d3.max(dataset_final, d=>parseInt(d.episodes)),13])]);}
    container_bubble.select('.eje_x_label').text("Episodes")   
    
  }

  else if (selectValue=="members") {
    xscale = d3.scaleLinear().range([PADDING, width_bubble - PADDING]);   
    if (dataset_final.length == 0) {xscale.domain([1, 1000]);}
    else{xscale.domain([1, d3.max([d3.max(dataset_final, d=>parseInt(d.members)),1000])]);}
    container_bubble.select('.eje_x_label').text("Members")   
    
  }
  container_bubble.selectAll('circle')
      .transition()
      .duration(200)
      .attr('cx', d => position("x", selectValue, d));
  axisBottom = d3.axisBottom(xscale).tickPadding(10);  
  xAxis.transition().duration(400).call(axisBottom);
})

d3.select('#eje_y').on('change', () =>{
  selectValue = d3.select('#eje_y').property('value');
  if (selectValue == "aired") {
    yscale = d3.scaleTime().range([height_bubble - PADDING, PADDING]);     
    yscale.domain([parseDate("1990-01-01"), parseDate("2020-01-01")]);
    container_bubble.select('.eje_y_label').text("Release Date")
  }
  else if (selectValue == "score") {
    yscale = d3.scaleLinear().range([height_bubble - PADDING, PADDING]);  
    yscale.domain([0, 10]); 
    container_bubble.select('.eje_y_label').text("Score")   
  }

  else if (selectValue == "episodes") {
    yscale = d3.scaleLinear().range([height_bubble - PADDING, PADDING]);
    if (dataset_final.length == 0) {yscale.domain([1, 13]);}
    else{yscale.domain([1, d3.max([d3.max(dataset_final, d=>parseInt(d.episodes)),13])]);}
    container_bubble.select('.eje_y_label').text("Episodes")
  }

  else if (selectValue=="members") {
    yscale = d3.scaleLinear().range([height_bubble - PADDING, PADDING]);   
    if (dataset_final.length == 0) {yscale.domain([1, 1000]);}
    else{yscale.domain([1, d3.max([d3.max(dataset_final, d=>parseInt(d.members)), 1000])]);}
    container_bubble.select('.eje_y_label').text("Members")
  }

  container_bubble.selectAll('circle')
    .transition()
    .duration(200)
    .attr('cy', d => position('y', selectValue, d));

  axisLeft = d3.axisLeft(yscale).tickPadding(10);  
  yAxis.transition().duration(400).call(axisLeft);
})

d3.select('#legends_button_on').on('click', d=>{
  d3.select("#toooodo").style('display', 'inline')
  
})

d3.select('#legends_button_off').on('click', d=>{
  d3.select("#toooodo").style('display', 'none')
  
})
