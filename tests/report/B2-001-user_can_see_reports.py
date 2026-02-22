from conftest import BASE_URL
import requests

def user_can_see_reports(tier1_login):
    report_id = "f451b377-d84a-4e2f-9819-bd1e7707a36d"
    response = requests.get(f"{BASE_URL}/api/report/{report_id}", cookies=tier1_login.cookies, timeout=10)
    assert response.status_code == 200, f"Unexpected response {response.json()}"
