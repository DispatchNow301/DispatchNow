from conftest import BASE_URL
import requests

def user_can_see_the_status_of_their_resource_request(tier2_login, supabase_client):
    description = "user can see the status of their resource request test"
    payload = {
        "resource_type": "food",
        "quantity": 10,
        "latitude": 37.774929,
        "longitude": -122.419416,
        "description": description
    }
    response = requests.post(f"{BASE_URL}/api/request/create",
                            json=payload, cookies=tier2_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("requests").select("*").eq("description", description).execute()
    assert result.data, "Request was not created"
    request_id = result.data[0]["id"]

    response = requests.get(f"{BASE_URL}/api/request/{request_id}",
                            cookies=tier2_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    supabase_client.table("requests").delete().eq("description", description).execute()
