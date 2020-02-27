import os
from flask import Flask, render_template, request, send_from_directory
from server.explore_admission_notes import doIT, predict

app = Flask(__name__, static_folder="react-ui/build/static", template_folder="react-ui/build")

model = None


@app.route("/predict")
def prediction():
    global model
    try:
        if model == None:
            model = doIT()
    except Exception as e:
        print(e, "UGH")
        return str(e)
    info = request.headers.get('info')
    return str(predict(model, info))


@app.route("/")
def index():
    return render_template("index.html")

@app.route('/send')
def sendIT():
    query_string = str(request.query_string).replace('b\'', '').replace('\'', '')
    return send_from_directory(filename=str(query_string), directory="staticML")


# @app.route('/sender')
# def sendIT():
#     query_string = str(request.query_string).replace('b\'', '').replace('\'', '')
#     return send_from_directory(filename=str(query_string), directory=app.instance_path+"staticML")


@app.route('/sends')
def sendITs():
    query_string = str(request.query_string).replace('b\'', '').replace('\'', '')
    return send_from_directory(filename=str(query_string), directory="react-ui/build/static")


@app.route('/help')
def help():
    return str([x[0] for x in os.walk(os.getcwd())])


@app.route("/hello")
def hello():
    return "Hello World!!!!!!!!!!!!!!!!!!!!!!!"


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=5000, threaded=True)
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
