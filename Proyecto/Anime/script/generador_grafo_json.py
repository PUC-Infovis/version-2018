import json
import os
from tqdm import tqdm

nodes = []
links = []

output = "..{}data{}recomendation.json".format(os.sep, os.sep)
recomendation_file = "..{}data{}name_id.csv".format(os.sep, os.sep)
anime_file = "..{}data{}base_final.csv".format(os.sep, os.sep)


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
