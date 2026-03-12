from conftest import BASE_URL
import requests

def user_cannot_use_an_invalid_email(supabase_client):
    email = "thisemaildoesntexist@example.com"
    payload = {
        "email": email,
        "password": "StrongPassw0rd!"
    }

    requests.post(f"{BASE_URL}/api/auth/register", json=payload, timeout=10)

    result = supabase_client.table("profiles").select("*").eq("email", email).execute()

    assert not result.data, f"Profile for {email} found in DB"
