import os
from tqdm import tqdm

with open("..{}data{}base_final.csv".format(os.sep, os.sep), encoding="UTF-8") as file:
    with open("autocomplete.js", "w", encoding="UTF-8") as file_2:
        file_2.write("var availableTags = [\n")
        header = file.readline()
        name_index = header.split(";").index("name")
        for elem in tqdm(file):
            text = '"{}",\n'.format(elem.split(";")[name_index].replace('"', "'"))
            file_2.write(text)

        file_2.write("]\n")

        text = '$( "#anime_autocomplete" ).autocomplete({\n  \
        minLength:3,\n   \
        source: availableTags\n  \
        });'
        file_2.write(text)
