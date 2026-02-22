from conftest import BASE_URL
import requests

def user_can_register_with_email(supabase_client):
    email = "dispatchnowtest1@gmail.com"
    payload = {
        "email": email,
        "password": "StrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"

    result = supabase_client.table("profiles").select("*").eq("email", email).execute()

    assert result.data, f"Profile for {email} not found in DB"

    supabase_client.table("profiles").delete().eq("email", email).execute()

    result = supabase_client.auth.admin.list_users()
    for user in result:
        if user.user_metadata["email"] == email:
            supabase_client.auth.admin.delete_user(user.id)
            break
