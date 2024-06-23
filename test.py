from RPi import GPIO
import sys
import time

all_out = [ 17, 27, 22, 23, 24, 25, 6, 13 ]
state = True
port = None

if len(sys.argv) > 1:
    arg = sys.argv[1].lower()
    if "=" in arg:
        port, arg = arg.split("=")
    state = arg == "true" or arg == "yes" or arg == "on"

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)


#
# negative logic
#
def setState(_port, _state):
    _port = int(_port)
    GPIO.setup(_port, GPIO.OUT)
    GPIO.output(_port, not _state)


if port is None:
    for w in all_out:
        setState(w, state)
else:
    port = int(port)
    if port not in all_out:
        print(f"invalid port: {port}")
    else:
        print(f"port: {port} is set to {state}")
        setState(port, state)

