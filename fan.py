from RPi import GPIO
import sys

state = True
if len(sys.argv) > 1:
    arg = sys.argv[1].lower()
    state = arg == "true" or arg == "yes" or arg == "on"

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.OUT)
GPIO.output(4, state)

