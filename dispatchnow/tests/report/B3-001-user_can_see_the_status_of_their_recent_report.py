from conftest import BASE_URL
import requests

def user_can_see_the_status_of_their_recent_report(tier1_login, supabase_client):
    description = "user can see the status of their recent report test"
    payload = {
        "description": description,
        "type": "flooding",
        "latitude": 37.774929,
        "longitude": -122.419416
    }
    response = requests.post(f"{BASE_URL}/api/report/create",
                            json=payload, cookies=tier1_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("reports").select("*").eq("description", description).execute()

    response = requests.get(f"{BASE_URL}/api/report/{result.data[0]["id"]}", cookies=tier1_login.cookies, timeout=10)
    assert response.json()["data"]["status"] == "unverified", f"Unexpected response {response.json()}"

    supabase_client.table("reports").delete().eq("description", description).execute()
