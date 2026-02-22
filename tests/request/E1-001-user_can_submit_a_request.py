from conftest import BASE_URL
import requests

def user_can_submit_a_request(tier2_login, supabase_client):
    description = "user can submit a request test"
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

    supabase_client.table("requests").delete().eq("description", description).execute()
