import os
import subprocess
import time
from pathlib import Path

import pytest
import requests
import dotenv

from supabase import create_client

dotenv.load_dotenv("../.env")

port = 3000
BASE_URL = f"http://localhost:{port}"

@pytest.fixture(scope="session")
def supabase_client():
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("SUPABASE_SECRET_KEY")
    return create_client(url, key)


@pytest.fixture(scope="session", autouse=False)
def start_server():
    process = subprocess.Popen(["npm", "run", "dev", "--", "--port", str(port)], cwd=Path(__file__).parent.parent)

    # wait until the server is listening
    for _ in range(30):
        try:
            requests.get(BASE_URL, timeout=1)
            break
        except Exception:
            time.sleep(1)
    else:
        process.kill()
        raise RuntimeError("Next.js dev server failed to start")

    yield

    process.terminate()  # shut down the server
    # you may have to kill the process yourself or run on a new port

def login(email):
    payload = {
        "email": email,
        "password": "StrongPassw0rd!"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=10)
    assert response.status_code == 200, f"Login failed {response.json()}"
    return response

@pytest.fixture()
def tier1_login():
    return login("kieranw147@gmail.com")

@pytest.fixture()
def tier2_login():
    return login("speedruns147@gmail.com")

@pytest.fixture()
def tier3_login():
    return login("kieran.watters@mail.utoronto.ca")
