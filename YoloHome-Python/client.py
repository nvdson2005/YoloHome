from Adafruit_IO import Client
import os
from dotenv import load_dotenv

load_dotenv()

username = os.getenv("ADAFRUIT_AIO_USERNAME")
key = os.getenv("ADAFRUIT_AIO_KEY")

if not username or not key:
    raise RuntimeError("Missing AIO_USERNAME or AIO_KEY in environment")

aio = Client(username=username, key=key)
