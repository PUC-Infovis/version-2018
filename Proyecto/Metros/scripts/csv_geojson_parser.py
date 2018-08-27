import csv
import os

# Script usado para poder hacer parser de un csv a formato geojson

# Script obtenido de :
# https://chenyuzuoo.github.io/posts/b9c48783/

# FILENAME = "../../transantiago/datos_denis/device_positions.csv/device_positions.csv"

base_name = 'data_'

data_folder = '../data/'
dow = {0: 'lunes', 1: 'Martes', 2: 'Miercoles', 3: 'Jueves', 4: 'Viernes', 5: 'Sabado', 6: 'Domingo'}

filenames = ['data_Lunes.csv', 'data_Martes.csv', 'data_Miercoles.csv',
             'data_Jueves.csv', 'data_Viernes.csv', 'data_Sabado.csv',
             'data_Domingo.csv']

outfiles = ['data_Lunes.geojson', 'data_Martes.geojson', 'data_miercoles.geojson',
             'data_jueves.geojson', 'data_Viernes.geojson', 'data_Sabado.geojson',
             'data_Domingo.geojson']

for i in range(7):
    print('CSV INPUT:{}'.format(filenames[i]))
    # filename = base_name + '{}.csv'.format(dow[i])
    # Read in raw data from csv
    rawData = csv.reader(open(data_folder + filenames[i], 'r'), dialect='excel')

    # the template. where data from the csv will be formatted to geojson
    template = \
        ''' \
        { "type" : "Feature",
            "geometry" : {
                "type" : "Point",
                "coordinates" : [%s, %s]},
                "properties" : { "index" : %s, "user_id" : "%s", "dow": "%s"}"}
                },
                '''
                # the head of the geojson file
    output = \
    ''' \
    { "type" : "Feature Collection",
    "features" : [
    '''
    # loop through the csv by row skipping the first
    iter = 0
    for row in rawData:
        iter += 1
        if iter >= 2:
            index = row[0]
            user_id = row[1]
            lat = row[2]
            lon = row[3]
            dow = row[7]
            # output += template % (row[0], row[2], row[1], row[3], row[4])
            output += template % (lon, lat,  index,  user_id, dow)

            # the tail of the geojson file
    output += \
    ''' \
        ]
    }
    '''

    # opens an geoJSON file to write the output to
    outFileHandle = open(data_folder + outfiles[i], "w+")
    outFileHandle.write(output)
    outFileHandle.close()
    print('GEOJSON OUTPUT:{}'.format(outfiles[i]))
print('Termine!')
