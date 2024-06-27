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


    def setState(self, _port, _state):
        _port = int(_port)
        GPIO.setup(_port, GPIO.OUT)
        GPIO.output(_port, _state)

    def setOn(self, _port):
        self.setState(_port, on)

    def setOff(self, _port):
        self.setState(_port, off)

    def reset(self):
        self.setState(self.N, off)



    def zero(self):
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.SE, on)
        self.setState(self.S, on)
        self.setState(self.SW, on)
        self.setState(self.NW, on)

    def one(self):
        self.setState(self.NE, on)
        self.setState(self.SE, on)

    def two(self):
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.C, on)
        self.setState(self.SW, on)
        self.setState(self.S, on)

    def three(self):
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.C, on)
        self.setState(self.SE, on)
        self.setState(self.S, on)

    def four(self):
        self.setState(self.NE, on)
        self.setState(self.SE, on)
        self.setState(self.C, on)
        self.setState(self.NW, on)

    def five(self):
        self.setState(self.N, on)
        self.setState(self.NW, on)
        self.setState(self.C, on)
        self.setState(self.SE, on)
        self.setState(self.S, on)

    def six(self):
        self.setState(self.N, on)
        self.setState(self.NW, on)
        self.setState(self.SW, on)
        self.setState(self.S, on)
        self.setState(self.SE, on)
        self.setState(self.C, on)

    def seven(self):
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.SE, on)

    def eight(self):
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.S, on)
        self.setState(self.SW, on)
        self.setState(self.SE, on)
        self.setState(self.NW, on)
        self.setState(self.C, on)

    def nine(self):
        self.setState(self.NW, on)
        self.setState(self.N, on)
        self.setState(self.NE, on)
        self.setState(self.C, on)
        self.setState(self.SE, on)




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




do math problem


