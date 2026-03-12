from conftest import BASE_URL
import requests
import time

def user_is_logged_out_automatically_after_inactivity(tier1_login):
    timeout_mins = 15
    time.sleep(timeout_mins * 60 + 10)

    # maybe resources can be seen without logging in. maybe change this later
    resource_id = "65d29815-3d4c-4bb2-8ace-6baad47dba5d"
    response = requests.get(f"{BASE_URL}/api/resource/{resource_id}", cookies=tier1_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
