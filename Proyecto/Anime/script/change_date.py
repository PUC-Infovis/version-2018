# ;id;name;score;episodes;aired;broadcast;source;duration;ranked;members;genres;recomendation
# 0;75; Kuroko no Basket 3rd Season;8.57;25;Jan 11, 2015 to Jun 30, 2015;Sundays at 01:58 (JST);Manga;24 min. per ep.;2;246,390;Comedy|Sports|School|Shounen;Haikyuu!!|Dear Boys|Captain Tsubasa: Road to 2002|Ballroom e Youkoso|Free!|Slam Dunk|Diamond no Ace|Durarara!!x2 Ketsu|Durarara!!x2 Ten|Durarara!!x2 Shou

# Date: Jan 11, 2015 to Jun 30, 201
import pandas as pd

months = {
'jan':1, 'feb':2, 'mar':3, 'apr': 4, 'may': 5, 'jun': 6,
'jul':7, 'aug':8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
}

def change(date):
    #print(date)
    if date == "Not available":
        return "2020-01-01"
    if 'to' in date:
        after, before = date.lower().split('to')
    else:
        after = date.lower()

    if "," in after:
        month_day, year = after.split(",")
        year = int(year)
    else:
        year = int(after)
        month_day = 'jan 01'
    if " " in month_day:
        month, day = month_day.split(" ")
    else:
        month = month_day
        day = 1

    #print(month)
    return "{}-{:02d}-{:02d}".format(year, months[month], int(day))



data = pd.read_csv("../data/base_final.csv", sep=";", encoding="utf-8")
print(data.head())
data["publish"] = data["aired"].apply(change)
data.to_csv("../data/database.csv", sep=";", index=False, encoding="utf-8")
print(data.head())
