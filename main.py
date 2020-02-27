from flask import Flask, render_template, request
from server.explore_admission_notes import doIT
from server.explore_admission_notes import predict

app = Flask(__name__, static_folder="react-ui/build/static", template_folder="react-ui/build")

model = None


@app.route("/predict")
def prediction():
    global model
    if model == None:
    	print("MUST BUILD ML","\n\n\n\n\n\n\n\n\n")
    	model = doIT()
    info = request.headers.get('info')
    return str(predict(model, info))


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/hello")
def hello():
    return "Hello World!!!!!!!!!!!!!!!!!!!!!!!"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, threaded=True)
    # app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
