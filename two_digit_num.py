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

    def display(self, index=-1):
        if index > -1:
            self.reset()
            self.num_list[index]()
        else:
            for i in self.num_list:
                self.reset()
                i()
                time.sleep(0.5)


class Tens(SevenSegment):
    N = 24
    S = 22
    NW = 17
    SW = 23
    NE = 25
    SE = 6
    C = 27


class Ones(SevenSegment):
    N = 3
    S = 16
    NW = 5
    SW = 13
    NE = 2
    SE = 12
    C = 26


def getTens(n):
    x = n/10
    y = int(x)
    return y

def getOnes(n):
    x = n/10  # take the tens digit
    y = int(x)   # drop the decimal point
    a = x - y + 0.05  # takes the decimal point and force round up
    b = int(a * 10)  # shift the decimal to right one place
    return b


def display_number(n):
    t = getTens(n)
    o = getOnes(n)
    ones = Ones()
    tens = Tens()
    tens.display(t)
    ones.display(o)


def resetAll():
    Ones().reset()
    Tens().reset()


def main(n):
    ones = Ones()
    tens = Tens()

    tens.display()
    ones.display()

    ones.reset()
    tens.reset()

###################
#
# test and debug use
#

if __name__ == "__main__":
    method_name = "main"
    method_list = [
        "main", "display_number", "zero",
        "one", "two", "three", "four", "five",
        "six", "seven", "eight", "nine"
    ]
    num_index = -1
    num = 0
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in method_list:
            method_name = arg
            num_index = method_list.index(method_name) - 2

    if len(sys.argv) > 2:
        num = int(sys.argv[2].lower())


    if num_index > -1:
        Ones().display(num_index)
        Tens().display(num_index)
    else:
        print(f"method name: {method_name}")
        print(f"-- display number: {num}")
        globals()[method_name](num)



