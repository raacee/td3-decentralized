import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from lightgbm import LGBMClassifier


data = pd.read_csv('final.csv')
data.set_index('PassengerId')
X = data.drop('Transported')
y = data['Transported']

rf = RandomForestClassifier(**{'class_weight': 'balanced_subsample', 'criterion': 'gini', 'max_depth': 4})
kNN = KNeighborsClassifier(**{'n_neighbors': 181, 'p': 1, 'weights': 'uniform'})
lgbm = LGBMClassifier(**{'learning_rate': 0.1, 'n_estimators': 50, 'num_leaves': 30, 'objective': 'binary'})

models = (rf, kNN, lgbm)

for model in models:
    model.fit(x,y)

