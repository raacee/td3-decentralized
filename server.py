from flask import Flask, request
from models import rf, kNN, lgbm, lr, svm


app = Flask(__name__)
url_params = [
    'homeplanet',
    'cryo',
    'dest',
    'age',
    'vip',
    'gp',
    'deck',
    'cabin',
    'side',
    'nfam',
    'ngp',
    'reg',
    'lux',
    'spendings'
]

@app.route('/')
def index():
    return "Server is listening"

@app.route('/lgbm', methods=['GET'])
def lgbm_prediction():
    x = [[float(request.args.get(feat)) for feat in url_params]]
    pred = lgbm.predict(x)
    return {
        "prediction":pred[0]
    }

@app.route('/knn', methods=['GET'])
def knn_prediction():
    x = [[float(request.args.get(feat)) for feat in url_params]]
    pred = kNN.predict(x)
    return {
        "prediction":pred[0]
    }

@app.route('/rf', methods=['GET'])
def rf_prediction():
    x = [[float(request.args.get(feat)) for feat in url_params]]
    pred = rf.predict(x)
    return "{\"prediction\":pred[0]}"

@app.route('/svm', methods=['GET'])
def svm_prediction():
    x = [[float(request.args.get(feat)) for feat in url_params]]
    pred = svm.predict(x)
    response = {"predictions":list(pred)[0]}
    print(f"THE PREDICTION IS :{response}")
    return response

@app.route('/lr', methods=['GET'])
def lr_prediction():
    x = [[float(request.args.get(feat)) for feat in url_params]]
    pred = lr.predict(x)
    return {
        "prediction":pred[0]
    }

@app.route('/consensus', methods=['GET'])
def consensus():
    return 404