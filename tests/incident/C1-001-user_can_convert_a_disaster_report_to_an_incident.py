from conftest import BASE_URL
import requests

def user_can_convert_a_disaster_report_to_an_incident(tier3_login, supabase_client):
    description = "user can convert a disaster report to an incident test"
    payload = {
        "title": "massive fire",
        "description": description,
        "priority": "high",
        "report_id": "f451b377-d84a-4e2f-9819-bd1e7707a36d"
    }
    response = requests.post(f"{BASE_URL}/api/incident/create",
                            json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("incidents").select("*").eq("description", description).execute()
    assert result.data, "Incident was not created"

    supabase_client.table("incidents").delete().eq("description", description).execute()
