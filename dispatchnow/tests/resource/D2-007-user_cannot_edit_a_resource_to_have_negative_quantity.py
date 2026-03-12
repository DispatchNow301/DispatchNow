from conftest import BASE_URL
import requests

def user_cannot_edit_a_resource_to_have_negative_quantity(tier3_login):
    payload = {
        "quantity": -10
    }
    resource_id = "65d29815-3d4c-4bb2-8ace-6baad47dba5d"
    response = requests.post(f"{BASE_URL}/api/resource/{resource_id}/edit",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"

    # feature not implemented yet
