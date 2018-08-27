import json
import pandas as pd
import os
from tqdm import tqdm


genres = {}
anime_file = "..{}data{}base_final.csv".format(os.sep, os.sep)

with open("../data/name_genre.csv") as file:
  file.readline()
  for line in tqdm(file):
    id_, genre = line.strip().split(",")
    if genre in genres:
      genres[genre].append(id_)
    else:
      genres[genre] =[]
#
#
for genre in tqdm(genres):
  data = []
  with open("../data/name_id.csv", encoding="UTF-8") as file:
    with open("../data/anime_per_genre/{}.csv".format(genre),"w", encoding="UTF-8") as file2:
      file2.write(file.readline())
      for line in file:
        id_, other_, users = line.strip().split(",")
        if int(users) > 1 and (id_ in genres[genre] or other_ in genres[genre]):
          file2.write(line)


for genre in genres:
    nodes = []
    links = []
    recomendation_file = "..{}data{}anime_per_genre{}{}.csv".format(os.sep, os.sep, os.sep, genre)
    output = "..{}data{}anime_per_genre{}recomendation_{}.json".format(os.sep, os.sep, os.sep, genre)


    with open(recomendation_file, encoding="UTF-8") as file:
      head = file.readline()
      for source, target, value in tqdm(elem.split(",") for elem in file):
          links.append({
          "target": int(target.strip("\n")),
          "source": int(source.strip("\n")),
          "users": int(value)
          })

    with open(anime_file, encoding="UTF-8") as file:
      head = file.readline()
      for anime in tqdm(file):
          anime = anime.split(";")
          nodes.append({
          "id": int(anime[0]),
          "name": anime[1].replace('"', "'")
          })

    with open(output, "w", encoding="UTF-8") as file:
      json.dump({"nodes": nodes, "links":links}, file, indent=4)
