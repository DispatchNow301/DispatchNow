from conftest import BASE_URL
import requests

def user_can_log_in_and_out(tier1_login):
    # maybe resources can be seen without logging in. maybe change this later
    resource_id = "65d29815-3d4c-4bb2-8ace-6baad47dba5d"
    response = requests.get(f"{BASE_URL}/api/resource/{resource_id}", cookies=tier1_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    response = requests.post(f"{BASE_URL}/api/auth/logout", timeout=10)
    assert response.status_code == 200, f"Logout failed {response.json()}"

    # maybe resources can be seen without logging in. maybe change this later
    resource_id = "65d29815-3d4c-4bb2-8ace-6baad47dba5d"
    response = requests.get(f"{BASE_URL}/api/resource/{resource_id}", cookies=tier1_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
