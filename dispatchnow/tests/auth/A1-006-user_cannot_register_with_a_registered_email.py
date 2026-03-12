from conftest import BASE_URL
import requests

def user_cannot_register_with_a_registered_email():
    payload = {
        "email": "kieranw147@gmail.com",
        "password": "StrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/register", json=payload, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
