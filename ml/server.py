from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import joblib
import pandas as pd

app = Flask("Team_TNEB")

loaded_model = joblib.load("model")
loaded_vect = joblib.load("vectorizer")

@app.route("/user", methods=["POST"])
def user():
    body = request.get_json()

    l = [body["message"]]
    df = pd.DataFrame(l, columns=["Query"])
    

    df = loaded_vect.transform(df["Query"])
    prediction = loaded_model.predict(df)

    return jsonify({ "prediction": str(prediction[0])})

app.run(port=9090)
