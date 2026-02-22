from conftest import BASE_URL
import requests
import time

def user_cannot_fail_many_log_in_attempts_in_a_row():
    payload = {
        "email": "kieranw147@gmail.com",
        "password": "WrongPassw0rd!"
    }

    for _ in range(15):
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=10)
        time.sleep(1)

    payload = {
        "email": "kieranw147@gmail.com",
        "password": "StrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=10)
    assert response.status_code != 200, f"Able to login {response.json()}"
