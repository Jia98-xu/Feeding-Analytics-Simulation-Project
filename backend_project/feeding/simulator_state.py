import threading
import time
import random
from .models import Feeding
from datetime import datetime

SIMULATOR_RUNNING = False

def generate_feeding():
    Feeding.objects.create(
        timestamp=datetime.now(),
        activity_level=random.randint(5, 20),
        oxygen=random.uniform(4, 10),
        temperature=random.uniform(20, 35),
        ph=random.uniform(6.5, 8.0)
    )
def run_simulator():
    global SIMULATOR_RUNNING
    while SIMULATOR_RUNNING:
        generate_feeding()
        time.sleep(5)
def start_simulator_thread():
    global SIMULATOR_RUNNING
    SIMULATOR_RUNNING = True
    threading.Thread(target=run_simulator, daemon=True).start()
