from conftest import BASE_URL
import requests

def user_can_submit_a_report(tier1_login, supabase_client):
    description = "user can submit a disaster report test"
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
    assert result.data, "Report was not created"

    supabase_client.table("reports").delete().eq("description", description).execute()
