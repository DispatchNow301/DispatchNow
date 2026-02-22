from conftest import BASE_URL
import requests

def user_cannot_input_over_the_maximum_field_length(tier1_login):
    payload = {
        "description": "description" * 1000,
        "type": "flooding",
        "latitude": 37.774929,
        "longitude": -122.419416
    }
    response = requests.post(f"{BASE_URL}/api/report/create",
                            json=payload, cookies=tier1_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
