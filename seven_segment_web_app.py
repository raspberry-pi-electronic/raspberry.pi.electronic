import os
from flask import Flask, request
from two_digit_num import display_number

#
# flask --app seven_segment_web_app run --host=0.0.0.0
#


app = Flask(__name__)

@app.route("/")
def hello_world():
    return """
<enter><h2>Show number on 7-segment display</h2></center>
<form action="/showNumber" method="POST">
   <div>
      <span>Enter a two-digit number: </span>
      <input type="text" name="num" value="">
   </div>
   <div>
      <input type="submit" value="Show Number">
   </div>
</form>
"""


@app.route("/showNumber", methods = ['GET', 'POST'])
def showNumber():
    num = 0
    if request.method == 'GET':
        num = request.args.get('num', default=0, type=int)

    else:
        num = int(request.form.get('num'))

    display_number(num)
    
    return hello_world()

