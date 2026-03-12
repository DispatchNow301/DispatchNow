from conftest import BASE_URL
import requests

def user_can_access_specific_endpoints_as_a_citizen(tier1_login):
    # update with endpoints
    valid_endpoints = ["/api/report"]

    for endpoint in valid_endpoints:
        response = requests.get(BASE_URL + endpoint, cookies=tier1_login.cookies, timeout=10)
        assert response.status_code == 200, f"Unable to access {endpoint}: {response.json()}"

    invalid_endpoints = ["/api/incident"]

    for endpoint in invalid_endpoints:
        response = requests.get(BASE_URL + endpoint, cookies=tier1_login.cookies, timeout=10)
        assert response.status_code != 200, f"Able to access {endpoint}: {response.json()}"
