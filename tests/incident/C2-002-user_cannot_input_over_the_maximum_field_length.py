from conftest import BASE_URL
import requests

def user_cannot_input_over_the_maximum_field_length(tier3_login):
    payload = {
        "title": "really long title " * 100,
        "description": "a description",
        "priority": "high",
        "report_id": "f451b377-d84a-4e2f-9819-bd1e7707a36d"
    }
    response = requests.post(f"{BASE_URL}/api/incident/create",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"
