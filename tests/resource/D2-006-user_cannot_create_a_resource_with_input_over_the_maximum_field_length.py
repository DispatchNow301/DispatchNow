from conftest import BASE_URL
import requests

def user_cannot_create_a_resource_with_input_over_the_maximum_field_length(tier3_login):
    payload = {
        "name": "very long name " * 100,
        "type": "food",
        "quantity": 120,
        "description": "a description"
    }
    response = requests.post(f"{BASE_URL}/api/resource/create",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
