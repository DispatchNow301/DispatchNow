from conftest import BASE_URL
import requests

def user_can_view_requests(tier3_login):
    request_id = "bc055b49-1bd2-4038-99e3-7ea0f3080a42"
    response = requests.get(f"{BASE_URL}/api/request/{request_id}",
                            cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"
