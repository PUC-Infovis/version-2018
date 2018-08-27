const WIDTH_GRAPH = 600;
const HEIGHT_GRAPH = 600;
const MARGIN_GRAPH = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 };
const width_graph = WIDTH_GRAPH - MARGIN_GRAPH.RIGHT - MARGIN_GRAPH.LEFT;
const height_graph = HEIGHT_GRAPH - MARGIN_GRAPH.TOP - MARGIN_GRAPH.BOTTOM;


var visited_anime = [];

var diameter = 500,
radius = diameter / 2,
innerRadius = radius-100;

var div = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);

var cluster = d3.cluster()
.size([360, innerRadius]);

var line = d3.radialLine()
             .curve(d3.curveBundle.beta(0.5))
             .radius(function(d) { return d.y; })
             .angle(function(d) { return d.x / 180 * Math.PI; });

const container = d3.select('#grafo')
    .append('svg')
    .attr('width', width_graph)
    .attr('heighth', height_graph)
    .attr('class', "graph_recomendation_2")

var svg = container
    .append('g')
    .attr("transform", "translate(" + width_graph/2 + "," + height_graph/2 + ")");
    
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var last_link = svg.selectAll(".link"),
    last_node = svg.selectAll(".node");

const reload = (path, size_min, size_max) =>{
  d3.json(path, (database) => {    
      database = database.filter( d=> size_max > d["size"] && d["size"] > size_min);

      var root = packageHierarchy(database).sum(function(d) {return d.size; });
      cluster(root);

        
      
      last_link= link
        .data(packageImports(root.leaves()))
        .enter().append("path")
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line);
    
      last_node = node
          .data(root.leaves())
          .enter().append("text")
          .attr("dy", "0.31em")
          .attr("class", "node")
          .style('stroke-width', d=>{
              if (visited_anime.some(e =>  e == d.data.id)){return 0.5}
              return 0
          })          
          .attr("transform", d => "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"))
          .attr("text-anchor", d => d.x < 180 ? "start" : "end")
          .on("mouseover", mouseovered)
          .on("mouseout", mouseouted)
          .on('click', click)
          .text(d => d.data.name.slice(6,30))
      

          
  });
}

var actual, last;
function mouseovered(d) {
  actual = new Date()
  last_node.each(function(n) { n.target = n.source = false; });

  last_link.classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  last_node.classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });

  div.transition()
        .duration(200)
        .style("opacity", .9);
      
        var genres = d.data.genres;
        while (genres.includes("|")) {genres = genres.replace("|", ", "); };
      
        document.getElementById("image_anime_r").src="image/"+d3.format("05")(d.data.id)+".jpg";
        // document.getElementById("anime_r").innerText  = "  " + d.data.key;
        document.getElementById("text_anime_r").innerHTML  =
        "<h4>" + d.data.key + "</h4>" +"<br/>" +
        "<b>Release Date: </b>" + d.data.aired + "<br/>" +
        "<b>Chapter(s): </b>" + d.data.episodes + "<br/>" +
        "<b>Genre(s): </b>" + genres + "<br/>"
        
};

const mouseouted = (d, index, nodos) => {
  
  last = new Date()
  var timeDiff = Math.abs(actual.getTime() - last.getTime());
  if (timeDiff>500) {
    visited_anime.push(d.data.id)
    d3.select(nodos[index]).style('stroke-width', 0.5);
  }
  
  last_link.classed("link--target", false)
           .classed("link--source", false);

  last_node.classed("node--target", false)
           .classed("node--source", false);

  div.transition()
     .duration(200)
     .style("opacity", 0);
}

const click = (d, index, nodos) => {
    visited_anime.push(d.data.id)
    d3.select(nodos[index]).style('stroke-width', 0.5);
    actualizar_bubble([d.data.id]);
  }

const packageHierarchy = (classes) => {
      var map = {};
      const find = (name, data) => {
          var node = map[name], i;
          if (!node) {
              node = map[name] = data || {name: name, children: []};
              if (name.length) {
                  node.parent = find(name.substring(0, i = name.lastIndexOf(">")));
                  if (node.parent.children) {
                      node.parent.children.push(node);
                      node.key = name.substring(i + 1);
                  }
              }
          }
          return node;
      }
      classes.forEach(d => find(d.name, d));
      return d3.hierarchy(map[""]);
}

const packageImports = (nodes) => {  
    var map = {};
    var imports = [];

    nodes.forEach((d) => {map[d.data.name] = d});
    nodes.forEach((d) => {
      if (d.data.imports) {
          d.data.imports.forEach((i) => {
            if (map[i]) {imports.push(map[d.data.name].path(map[i]));}
          });
      }
    });
    return imports;
}

const numbers = {
  'Action':       80,
  'Adventure':    40,
  'SuperPower':   17,
  'Comedy':       80,
  'Drama':        70,
  'Ecchi':        20,
  'Historical' :  15,
  'Fantasy':      50,
  'Horror':       10,
  'Military':     10
}

var min_value = d3.select('#myRange_min');
var max_value = d3.select('#myRange_max')

function updateTextInput(val) {
    document.getElementById('myRange_max').nextSibling.nodeValue=`Max: ${val}`; 
  }

  function updateTextInput_2(val) {
    document.getElementById('myRange_min').nextSibling.nodeValue=`Min: ${val}`; 
  }
d3.select("#genero_option").on('change', () =>{
    var genrer = d3.select('#genero_option').property('value');
    var quality_min = numbers[genrer]
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();
    reload(`data/datos_finales/${genrer}.json`, quality_min, 1000)
    min_value.property('value', quality_min);
    d3.select('#myRange_min').innerHTML = "Min: 231" 

});

d3.select('#genero_option').property('value', 'SuperPower');
reload(`data/datos_finales/SuperPower.json`, numbers['SuperPower'], 1000)
d3.select("#clean_recomendation").on('click', ()=>{
 visited_anime = []
 d3.selectAll(".node").style('stroke-width',0)
})

d3.select("#search_recomendation").on('click', ()=>{
  var anime = d3.select('#anime_autocomplete').property('value');
  last_node.each(d=>{
    if (d.data.key == anime) {
      mouseovered(d)
    }
  })
 

  
 })

 var auxiliar = svg.append('g');
 
 auxiliar.append('rect')
    .attr('x', -300)
    .attr('y', -300)
    .attr('height', 30)
    .attr('width', 30)
    .attr('fill', '#2ca02c')

auxiliar .append('rect')
    .attr('x', -300)
    .attr('y', -260)
    .attr('height', 20)
    .attr('width', 30)
    .attr('fill', '#d62728')
    
auxiliar.append('text')
    .attr('x', -260)
    .attr('y', -245)    
    .text('Recommends')

    auxiliar.append('text')
    .attr('x', -260)
    .attr('y', -275)
    .text('Recommended')
    