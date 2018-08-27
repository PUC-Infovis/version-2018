# InfoVis
**Se debe crear una carpeta llamada `image` cuyo contenido serán todas las imagenes que se encuentran en este [link](https://drive.google.com/drive/u/1/folders/15fz8_yeok2FT-TzEp-OZBUS5cmSqBtrB)**

### Link a la visualización: [https://hernan4444.github.io/InfoVis/](https://hernan4444.github.io/InfoVis/)

## Tarea 4 -¿Qué entregaremos?

1. Bubblechart
2. Grafo

## ¿ Cómo esperamos de la visualización?

El usuario podrá seleccionar algún género de los disponible y en el grafo se mostrarán todos las recomendaciones que involucren animes con dicho género. (Esta información ya estará predefinida en csv adecuados)

En el grafo se podrá seleccionar mediante el arrastre del mouse, se podra desplazar por el grafo (drag) y hacer zoom.

Solo se mostrarán recomendaciones que hayan sido por 2 o más usuarios.


Cuando se pasa el _mouse_ por un nodo del grafo o bubblechart, se debe despregar la información básica de ese nodo:
1. Nombre
2. Fecha de estreno
3. Capítulos
4. Géneros

Tambien existirá un buscador de anime en el grafo y cuando se busque uno, este se resaltará de otro color. Uno puede buscar así muchos animes y verlos en el grafo resaltados. Existirá un botón de "Clear" el cual deja de resaltar todos esos nodos.

Hacer `dobleclick` sobre un anime abrirá la página de animelist

Hacer click en un nodo del grafo hará que se agrege al bubblechart.

Uno puede seleccionar muchos nodos (arrastrando el mouse) y oprimir un boton de "Comparar" y todos esos animes seleccionados se irán al **bubblechart**.

Tambien se generará una tabla debajo del bubblechart con la información de cada anime en bubblecharte. La tabla debe permitir ordenar por diferentes criterios.

### Marcas

#### Grafo
En el grafo, el color representa la compañia. Cuando se busca un anime su color cambia a Magenta (para destacar). Los grafos seleccionados quedan con bordes diferentes

El color del link representa el rango de recomendaciones (1 a 4, 5 a 10, 11 a 30 y 30 en adelante) (4 colores)

El tamaño será uniforme.

#### Bubblechart

1. Eje x es la fecha de estreno
1. Eje Y es el score.
1. El tamaño será los miembros que ven el anime
1. El color es la compañia

#### Formas de interactuar
1. El bubblechart recibe una lista de id de los animes a mostrar y los agrega.
1. Hay un boton clear que elimina todo.
1. Tambien está la opcion de buscar animes que tengan un conjunto de generos seleccionados. Y el bubblechart muestra todos esos (limpiando lo anterior)

;;;;episodes;;;source;duration;ranked;;;
### Atributos utilizados

- Recomendaciones (grafo)
- Géneros (grafo y bubblechart)
- Fecha de estreno (bubblechart)
- score (bubblechart)
- Studios (grafo y bubblechart)
- Usuarios que ven el anime (bubblechart)
- Nombre (grafo y bubblechart)


### Atributos sin utilizar

- Broadcast
- Episodes:
- duration:
- source:
- ranked

### Comentarios o ideas
- Podriamos hacer que el eje Y del bubble chart puede cambiar entre Score y ranked
- El color en el bubblechat podria cambiar entre Studios o el source
- Desechar Broadcast
- Hacer graficos de barra con los animes seleccinoados donde se compare score, ranked, episodes y duration (4 mini gráficos)


### Orden de ejecutar cosas:
1. Python notebook de preprocesar para scraping y unificar data
1. Ejecutar name-genre.py y name-id.py
1. Ejecutar autocomplete.py
1. ejecutar change_date.py
1. ejecutar generador_grafo_json.py
1. ejecutar script que está en data, agregar su output al index.html y al bubblechat.html
1. Guardar cada posicion de los nodos dado un género en el grafo en csv distintos
