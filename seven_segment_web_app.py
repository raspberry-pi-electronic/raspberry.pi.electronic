from flask import Flask, request
from two_digit_num import *



app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"



