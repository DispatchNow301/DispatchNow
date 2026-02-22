from conftest import BASE_URL
import requests

def user_cannot_upload_an_invalid_file_type_for_the_resource_picture(tier3_login):
    payload = {
        "name": "user cannot upload an invalid file type for the resource picture test",
        "type": "food",
        "quantity": 120,
        "description": "a description",
        "picture": "picture.mp4"
    }
    response = requests.post(f"{BASE_URL}/api/resource/create",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code != 200, f"Unexpected response {response.json()}"

    # feature not implemented yet
