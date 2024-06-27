from RPi import GPIO
import sys
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

on = False
off = True


class SevenSegment:
    N = None
    S = None
    NW = None
    SW = None
    NE = None
    SE = None
    C = None
    
    num_list = [
    ]
    
    def __init__(self):
        self.num_list = [
            self.zero,
            self.one,
            self.two,
            self.three,
            self.four,
            self.five,
            self.six,
            self.seven,
            self.eight,
            self.nine
        ]

    def setState(self, _port, _state):
        _port = int(_port)
        GPIO.setup(_port, GPIO.OUT)
        GPIO.output(_port, _state)

    def setOn(self, _port):
        self.setState(_port, on)

    def setOff(self, _port):
        self.setState(_port, off)

    def reset(self):
        self.setOff(self.N)
        self.setOff(self.NE)
        self.setOff(self.SE)
        self.setOff(self.S)
        self.setOff(self.SW)
        self.setOff(self.NW)
        self.setOff(self.C)


    def zero(self):
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.SE)
        self.setOn(self.S)
        self.setOn(self.SW)
        self.setOn(self.NW)

    def one(self):
        self.setOn(self.NE)
        self.setOn(self.SE)

    def two(self):
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.C)
        self.setOn(self.SW)
        self.setOn(self.S)

    def three(self):
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.C)
        self.setOn(self.SE)
        self.setOn(self.S)

    def four(self):
        self.setOn(self.NE)
        self.setOn(self.SE)
        self.setOn(self.C)
        self.setOn(self.NW)

    def five(self):
        self.setOn(self.N)
        self.setOn(self.NW)
        self.setOn(self.C)
        self.setOn(self.SE)
        self.setOn(self.S)

    def six(self):
        self.setOn(self.N)
        self.setOn(self.NW)
        self.setOn(self.SW)
        self.setOn(self.S)
        self.setOn(self.SE)
        self.setOn(self.C)

    def seven(self):
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.SE)

    def eight(self):
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.S)
        self.setOn(self.SW)
        self.setOn(self.SE)
        self.setOn(self.NW)
        self.setOn(self.C)

    def nine(self):
        self.setOn(self.NW)
        self.setOn(self.N)
        self.setOn(self.NE)
        self.setOn(self.C)
        self.setOn(self.SE)

    def display(self):
        for i in self.num_list:
            self.reset()
            self.num_list[i]()
            time.sleep(1)




class Ones(SevenSegment):
    N = 24
    S = 22
    NW = 17
    SW = 23
    NE = 25
    SE = 6
    C = 27


class Tens(SevenSegment):
    N = 3
    S = 16
    NW = 5
    SW = 13
    NE = 2
    SE = 12
    C = 26


def main():
    ones = Ones()
    tens = Tens()

    ones.display()
    tens.display()



###################
#
# test and debug use
#

method_name = "main"
method_list = [
    "main",
    "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "zero"
]
if len(sys.argv) > 1:
    arg = sys.argv[1].lower()
    if arg in method_list:
        method_name = arg

if method_name is "main":
    main()

# do math problem


