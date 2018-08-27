var fs = require('fs')
var data_dow = require('../data/dow_data/dow-data.json')

const nororiente = ['Providencia', 'Las Condes', 'La Reina', 'Ñuñoa', 'Vitacura', 'Lo Barnechea']
const suroriente = ['Macul', 'Peñalolén', 'La Florida']
const surponiente = ['Estación Central', 'Maipú', 'Cerrillos']
const norponiente = ['Cerro Navia', 'Lo Prado', 'Pudahuel', 'Quinta Normal']
const norte = ['Conchalí', 'Huechuraba', 'Independencia', 'Recoleta' ,'Quilicura']
const centro = ['Santiago']
const sur = ['Pedro Aguirre Cerda', 'San Miguel', 'San Joaquín', 'Lo Espejo', 'La Cisterna',
            'La Granja', 'San Ramón', 'El Bosque', 'La Pintana']

const sectores = [nororiente, suroriente, surponiente, norponiente, norte,
                  centro, sur]

const sectores_nombres = ['nororiente', 'suroriente', 'surponiente', 'norponiente',
                          'norte', 'centro', 'sur']

const day_of_week = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

var data_sector = {};
var sector_name = 0;

sectores.forEach(sector => {
  var sector_count = {};
  day_of_week.forEach(day => {
    count = 0
    sector.forEach(comuna => {
      count += data_dow[day][comuna]
    })
    sector_count[day] = count
    // console.log(sectores_nombres[sector_name], sector_count);
  })
  data_sector[sectores_nombres[sector_name]] = sector_count;
  sector_name = sector_name + 1;
})

fs.writeFile('sectores_trips.json', JSON.stringify(data_sector), (err) => {
  if (err) throw(err);

  console.log('File creado');

})
// console.log(data_dow);
