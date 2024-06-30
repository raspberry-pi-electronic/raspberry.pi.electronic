import os
from flask import Flask, request, send_from_directory
from two_digit_num import display_number

#
# flask --app seven_segment_web_app run --host=0.0.0.0
#


app = Flask(__name__)

@app.route("/")
def hello_world():
    return send_from_directory("static", "home.html")

@app.route('/static/<path:path>')
def send_report(path):
    return send_from_directory('reports', path)

@app.route("/showNumber", methods = ['GET', 'POST'])
def showNumber():
    num = 0
    if request.method == 'GET':
        num = request.args.get('num', default=0, type=int)

    else:
        num = int(request.form.get('num'))

    display_number(num)
    
    return hello_world()

