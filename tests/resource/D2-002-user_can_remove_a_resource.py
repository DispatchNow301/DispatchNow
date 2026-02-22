from conftest import BASE_URL
import requests

def user_can_remove_a_resource(tier3_login, supabase_client):
    name = "user can remove a resource test"
    payload = {
        "name": name,
        "type": "food",
        "quantity": 120,
        "description": "a description"
    }
    response = requests.post(f"{BASE_URL}/api/resource/create",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("resources").select("*").eq("name", name).execute()
    assert result.data, "Resource was not created"
    resource_id = result.data[0]["id"]

    response = requests.post(f"{BASE_URL}/api/resource/{resource_id}/remove",
                            json={}, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("resources").select("*").eq("name", name).execute()
    assert not result.data, "Resource was not removed"

    # feature not implemented yet
