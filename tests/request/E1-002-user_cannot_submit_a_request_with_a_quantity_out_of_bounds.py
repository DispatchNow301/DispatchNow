from conftest import BASE_URL
import requests

def user_cannot_submit_a_request_with_a_quantity_out_of_bounds(tier2_login):
    payload = {
        "resource_type": "food",
        "quantity": 0,
        "latitude": 37.774929,
        "longitude": -122.419416,
        "description": "a description"
    }
    response = requests.post(f"{BASE_URL}/api/request/create",
                            json=payload, cookies=tier2_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"

    payload = {
        "resource_type": "food",
        "quantity": -10,
        "latitude": 37.774929,
        "longitude": -122.419416,
        "description": "a description"
    }
    response = requests.post(f"{BASE_URL}/api/request/create",
                            json=payload, cookies=tier2_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"

    payload = {
        "resource_type": "food",
        "quantity": 99999999,
        "latitude": 37.774929,
        "longitude": -122.419416,
        "description": "a description"
    }
    response = requests.post(f"{BASE_URL}/api/request/create",
                            json=payload, cookies=tier2_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
