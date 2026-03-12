from conftest import BASE_URL
import requests

def user_cannot_leave_fields_blank():
    payload = {
        "email": "",
        "password": ""
    }

    response = requests.post(f"{BASE_URL}/api/auth/register", json=payload, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
