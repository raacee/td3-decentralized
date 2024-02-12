from flask import Flask, request
from models import 

app = Flask(__name__)

@app.route('/')
def index():
    return "Server is listening"

@app.route('/lgbm')
def lgbm_prediction():
    return 404

@app.route('/knn')
def knn_prediction():
    return 404

@app.route('/rf')
def rf_prediction():
    return 404
