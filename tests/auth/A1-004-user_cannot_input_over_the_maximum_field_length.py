from conftest import BASE_URL
import requests

def user_cannot_input_over_the_maximum_field_length():
    payload = {
        "email": "dispatchnowtest1@gmail.com",
        "password": "StrongPassw0rd!" * 10
    }

    response = requests.post(f"{BASE_URL}/api/auth/register", json=payload, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
