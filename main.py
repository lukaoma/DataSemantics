from flask import Flask, render_template
import requests
app = Flask(__name__, static_folder="react-ui/build/static", template_folder="react-ui/build")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/hello")
def hello():
    return "Hello World!!!!!!!!!!!!!!!!!!!!!!!"

def index(request):
    r = requests.get('http://httpbin.org/status/418')
    print(r.text)
    return HttpResponse('<pre>' + r.text + '</pre>')

if __name__ == "__main__":
	print("THINGS ARE RUNNING")
    app.run(host='0.0.0.0', port=5000, threaded=True)
    #app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
