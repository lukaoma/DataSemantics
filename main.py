import os
from flask import Flask, render_template, request, send_from_directory
from server.explore_admission_notes import doIT, predict
from flask_cors import CORS
import json
app = Flask(__name__, static_folder="react-ui/build/static", template_folder="react-ui/build")
CORS(app)

model = None


@app.route("/predict", methods=['POST'])
def prediction():
    global model
    try:
        if model == None:
            model = doIT()
    except Exception as e:
        print(e, "UGH")
        return str(e)
    info = json.loads(request.data)["note"]
    return str(predict(model, info))


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/send')
def send():
    fileName = request.headers.get('fileName')
    return send_from_directory(filename=str(fileName), directory="./server/static")


@app.route('/help')
def help():
    return str([x[0] for x in os.walk(os.getcwd())])


@app.route("/hello")
def hello():
    return "Hello World!!!!!!!!!!!!!!!!!!!!!!!"


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=5000, threaded=True)
    app.run(host='localhost', port=5000, threaded=True, debug=True)
