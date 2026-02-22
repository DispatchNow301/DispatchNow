from conftest import BASE_URL
import requests

def user_can_change_the_role_of_another_user(tier3_login, supabase_client):
    user_id = "f4b9a490-cfa1-4a9e-9dc4-b221288cba47"
    response = requests.post(f"{BASE_URL}/api/user/{user_id}/assign",
                             cookies=tier3_login.cookies, json={"tier": 2}, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("profiles").select("*").eq("id", user_id).execute()
    assert result.data[0]["tier"] == 2, "Role did not change"

    response = requests.post(f"{BASE_URL}/api/user/{user_id}/assign",
                             cookies=tier3_login.cookies, json={"tier": 1}, timeout=10)
