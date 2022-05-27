from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import joblib
import pandas as pd

import jwt

app = Flask("Team_TNEB")

loaded_model = joblib.load("model")
loaded_vect = joblib.load("vectorizer")

@app.route("/user", methods=["POST"])
def user():
    try:
        body = request.get_json()

        token = body["token"]
        decode = jwt.decode(token, "TEAM_TNEB")

        l = [body["message"]]
        df = pd.DataFrame(l, columns=["Query"])
        

        df = loaded_vect.transform(df["Query"])
        prediction = loaded_model.predict(df)

        return jsonify({ "prediction": str(prediction[0])})

    except:
        return jsonify({ "prediction": "str(prediction[0])"})

app.run(port=9090)

# api = Api(app)

# class Model(Resource):
#     def post(self):
#         body = request.get_json()
#         print(body)

#         response = {
#             "name": "Rajesh",
#             "age": 21
#         }

#         return jsonify(response)


# api.add_resource(Model, '/')