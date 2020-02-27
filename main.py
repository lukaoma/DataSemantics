from flask import Flask, render_template, send_from_directory, request
from joblib import load
from server.explore_admission_notes import doIT
from server.explore_admission_notes import predict

app = Flask(__name__, static_folder="react-ui/build/static", template_folder="react-ui/build")



@app.route("/")
def index():
    return render_template("index.html")


@app.route("/hello")
def hello():
    return "Hello World!!!!!!!!!!!!!!!!!!!!!!!"


@app.route("/predict")
def prediction():
    info = request.headers.get('info')
    return str(predict(app.MLmodel, info))


if __name__ == "__main__":
    model = doIT()
    app.MLmodel = model
    app.run(host='0.0.0.0', port=5000, threaded=True)
    # app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
