from conftest import BASE_URL
import requests

def user_can_view_resources(tier1_login):
    resource_id = "65d29815-3d4c-4bb2-8ace-6baad47dba5d"
    response = requests.get(f"{BASE_URL}/api/resource/{resource_id}", cookies=tier1_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"
