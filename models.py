import pandas as pd
import numpy as np
from lightgbm import LGBMClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


data = pd.read_csv('final.csv')
data.set_index('PassengerId', inplace=True)
X = data.drop('Transported', axis= 1)
data.drop('LastName', axis = 1)
y = data['Transported']

rf = RandomForestClassifier(**{'class_weight': 'balanced_subsample', 'criterion': 'gini', 'max_depth': 4})
kNN = KNeighborsClassifier(**{'n_neighbors': 181, 'p': 1, 'weights': 'uniform'})
lgbm = LGBMClassifier(**{'learning_rate': 0.1, 'n_estimators': 50, 'num_leaves': 30, 'objective': 'binary'})
lr = LogisticRegression(**{'class_weight': 'balanced'})
svm = SVC(**{'kernel': 'rbf', 'C': 1.0, 'gamma': 'scale'})




models = (rf, kNN, lgbm, lr, svm)

for model in models:
    model.fit(X,y)



    
