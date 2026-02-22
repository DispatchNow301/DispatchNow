from conftest import BASE_URL
import requests

def user_can_approve_and_deny_requests(tier3_login, supabase_client):
    request_id = "bc055b49-1bd2-4038-99e3-7ea0f3080a42"

    # approve
    payload = {
        "status": "approved"
    }
    response = requests.post(f"{BASE_URL}/api/request/{request_id}/approve",
                             json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"


    result = supabase_client.table("requests").select("*").eq("id", request_id).execute()
    assert result.data[0]["status"] == "approved", "Request was not approved"

    # deny
    payload = {
        "status": "rejected"
    }
    response = requests.post(f"{BASE_URL}/api/request/{request_id}/approve",
                             json=payload, cookies=tier3_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"


    result = supabase_client.table("requests").select("*").eq("id", request_id).execute()
    assert result.data[0]["status"] == "rejected", "Request was not rejected"

    supabase_client.table("requests").update({"status": "pending"}).eq("id", request_id).execute()
