import os
from flask import Flask, request, send_from_directory
from two_digit_num import display_number, resetAll
import json

#
# flask --app seven_segment_web_app run --host=0.0.0.0
#


app = Flask(__name__)

@app.route("/")
def hello_world():
    return send_from_directory("static", "home.html")

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/static/js/<path:path>')
def send_static_js(path):
    return send_from_directory('static/js', path)


@app.route("/showNumber", methods=['GET', 'POST'])
def showNumber():
    num = 0
    if request.method == 'GET':
        num = request.args.get('num', default=0, type=int)

    else:
        try:
            num = int(request.form.get('num'))
        except:
            data = request.json
            num = int(data["num"])

    display_number(num)
    
    return json.dumps({"result": "OK", "number: ": num}), 200, {'content-type': 'application/json'}


@app.route("/clearNumber", methods=['GET', 'POST'])
def clearNumber():
    resetAll()
    return json.dumps({"result": "OK"}), 200, {'content-type': 'application/json'}


