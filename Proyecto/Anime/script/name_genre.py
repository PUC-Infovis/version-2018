
# coding: utf-8

# In[113]:

import pandas as pd
from tqdm import tqdm 


# ## name_genre

# In[171]:

data = pd.read_csv('base_final.csv', encoding='utf-8', sep=';')
name_id = data[['id', 'name']]


# In[173]:

name = data['name']
genre = data['genres']


# In[185]:

df_name_genre = []


# In[186]:

for i in tqdm(range(len(name))):
    for  j in genre[i].split('|'):
        aux = []
        aux.append(list(name_id[name_id['name'].str.strip() == name[i].strip()]['id'])[0])
        aux.append(j)
        df_name_genre.append(aux)


# In[187]:

df_name_genre = pd.DataFrame(df_name_genre, columns=['name_id', 'genre'])


# In[189]:

df_name_genre.to_csv('name_genre.csv', index=False)


# In[ ]:



