import requests
import random
import time
from datetime import datetime

#--- 配置参数 ---
API_URL = 'http://127.0.0.1:8000/api/feedings/' #后端API地址
INTERVAL = 5  #数据发送频率, 5秒
SIM_STATUES_URL = 'http://127.0.0.1:8000/api/feedings/simulator/status/'  # 模拟器状态接口

#--生成随机数据--
def generate_activity():
    """生成随机的喂食活动数据"""
    return round(random.uniform(0, 10), 2)  # 喂食量，单位为公斤

def generate_temperature():
    """生成随机的温度数据"""
    return round(random.uniform(25, 32), 1)  # 温度，单位为摄氏度

def generate_oxygen():
    """生成随机的溶解氧数据"""
    return round(random.uniform(3, 8), 2)  # 溶解氧，单位为mg/L

def generate_ph():
    """生成随机的pH值数据"""
    return round(random.uniform(6.5, 8.0), 2)  # pH值

#--发送数据--
def send_feeding():
    """发送喂食数据到后端API"""
    data = {
        'activity_level': generate_activity(),
        'temperature': generate_temperature(),
        'oxygen': generate_oxygen(),
        'ph': generate_ph(),
    }
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code in [200, 201]:
            print(f"{datetime.now().strftime('%H:%M:%S')}] Sent:{data}")
        else:
            print(f"Failed to send: {response.status_code} {response.text}")
    except Exception as e:
        print("Error:", e)

#--查询模拟器状态--
def is_simulator_running():
    """检查模拟器是否处于运行状态"""
    try:
        resp = requests.get(SIM_STATUES_URL)
        if resp.status_code == 200:
            return resp.json().get('running', False)
    except Exception as e:
        print("Error:", e)
    return False

#--主程序循环--
if __name__ == '__main__':
    print("Starting Feeding Simulation...")
    while True:
        running = is_simulator_running()
        if running:
            send_feeding()
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Simulator paused by backend")
            
        time.sleep(INTERVAL)
