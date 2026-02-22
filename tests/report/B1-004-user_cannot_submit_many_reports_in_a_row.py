from conftest import BASE_URL
import requests
import time

def user_cannot_submit_many_reports_in_a_row(tier1_login):
    for i in range(5):
        payload = {
            "description": "description",
            "type": "flooding",
            "latitude": 38.774929 + i,
            "longitude": -122.419416
        }
        response = requests.post(f"{BASE_URL}/api/report/create",
                                json=payload, cookies=tier1_login.cookies, timeout=10)
        time.sleep(1)

    payload = {
        "description": "description",
        "type": "flooding",
        "latitude": 37.774929,
        "longitude": -122.419416
    }
    response = requests.post(f"{BASE_URL}/api/report/create",
                                json=payload, cookies=tier1_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
