from conftest import BASE_URL
import requests

def user_cannot_log_in_with_incorrect_email_or_password():
    payload = {
        "email": "kieranw147@gmail.com",
        "password": "WrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"

    payload = {
        "email": "kieranw148@gmail.com",
        "password": "StrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
