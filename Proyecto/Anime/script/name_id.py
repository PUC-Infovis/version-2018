
# coding: utf-8

# In[113]:

import pandas as pd
from tqdm import tqdm 


# In[114]:

data = pd.read_csv('base_final.csv', encoding='utf-8', sep=';')


# In[116]:

name_id = data[['id', 'name']]
ids = data['id']


# In[117]:

recomendation = data['recomendation']


# In[161]:

new_recomendatios = []
for r in tqdm(recomendation):
    if isinstance(r, str): 
        r = r.split('|')
        aux = []
        for anime in r:
            try:
                aux.append(list(name_id[name_id['name'].str.strip() == anime.strip()]['id'])[0])
            except IndexError:
                pass
        new_recomendatios.append(aux)
    else:
        new_recomendatios.append([-1])
    
    


# In[167]:

df_name_id = []
for i in tqdm(range(len(ids))):
    for j in new_recomendatios[i]:
        if (j == -1):
            print(j)
            break
        aux = []
        aux.append(ids[i])
        aux.append(j)
        df_name_id.append(aux)
        


# In[168]:

df_name_id = pd.DataFrame(df_name_id, columns=['name_id', 'recom_id'])


# In[169]:

df_name_id.to_csv('name_id.csv', index=False)

