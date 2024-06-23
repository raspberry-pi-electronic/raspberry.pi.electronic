from RPi import GPIO
import sys
import time

all_out = [ 17, 27, 22, 23, 24, 25, 6, 13 ]
state = True
port = None

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

on = False
off = True

#
# negative logic
#
def setState(_port, _state):
    _port = int(_port)
    GPIO.setup(_port, GPIO.OUT)
    GPIO.output(_port, _state)

####################
#

N = 17
S = 24
NW = 13
SW = 23
NE = 27
SE = 22
C = 25


def reset():
    for p in all_out:
        setState(p, off)


def zero():
    setState(N, on)
    setState(NE, on)
    setState(SE, on)
    setState(S, on)
    setState(SW, on)
    setState(NW, on)


def one():
    setState(NE, on)
    setState(SE, on)


def two():
    setState(N, on)
    setState(NE, on)
    setState(C, on)
    setState(SW, on)
    setState(S, on)


def three():
    setState(N, on)
    setState(NE, on)
    setState(C, on)
    setState(SE, on)
    setState(S, on)


def four():
    setState(NE, on)
    setState(SE, on)
    setState(C, on)
    setState(NW, on)


def five():
    setState(N, on)
    setState(NW, on)
    setState(C, on)
    setState(SE, on)
    setState(S, on)


def six():
    setState(N, on)
    setState(NW, on)
    setState(SW, on)
    setState(S, on)
    setState(SE, on)
    setState(C, on)


def seven():
    setState(N, on)
    setState(NE, on)
    setState(SE, on)


def eight():
    setState(N, on)
    setState(NE, on)
    setState(S, on)
    setState(SW, on)
    setState(SE, on)
    setState(NW, on)
    setState(C, on)


def nine():
    setState(NW, on)
    setState(N, on)
    setState(NE, on)
    setState(C, on)
    setState(SE, on)




##### fun stuff

def countUp():
    for i in range(0, 10):
        i = 9 - i
        if i == 0:
            zero()
        elif i == 1:
            one()
        elif i == 2:
            two()
        elif i == 3:
            three()
        elif i == 4:
            four()
        elif i == 5:
            five()
        elif i == 6:
            six()
        elif i == 7:
            seven()
        elif i == 8:
            eight()
        elif i == 9:
            nine()

        time.sleep(1)
        reset()
        

def main():
    countUp()


###################
#
method_name = "main"
method_list = [
    "main",
    "one", "two", "three", "four", "five"
    "six", "seven", "eight", "nine", "zero"
]
if len(sys.argv) > 1:
    arg = sys.argv[1].lower()
    if arg in method_list:
        method_name = arg


reset()
globals()[method_name]()

