from conftest import BASE_URL
import requests

def user_can_close_pause_and_reopen_incidents(tier3_login, supabase_client):
    incident_id = "bc993ffa-f651-403f-b2ab-5b5b6a45cb30"

    # pause
    response = requests.post(f"{BASE_URL}/api/incident/{incident_id}/pause",
                            json={}, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("incidents").select("*").eq("id", incident_id).execute()
    assert result.data[0]["status"] == "paused", "Incident was not paused"

    # reopen
    response = requests.post(f"{BASE_URL}/api/incident/{incident_id}/reopen",
                            json={}, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("incidents").select("*").eq("id", incident_id).execute()
    assert result.data[0]["status"] == "active", "Incident was not reopened"

    # close
    response = requests.post(f"{BASE_URL}/api/incident/{incident_id}/close",
                            json={}, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("incidents").select("*").eq("id", incident_id).execute()
    assert result.data[0]["status"] == "closed", "Incident was not closed"

    supabase_client.table("incidents").update({"status": "active"}).eq("id", incident_id).execute()

    # pause and reopen have not been implemented
