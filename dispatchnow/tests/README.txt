To run tests do:

./setup.sh
./run_tests.sh [test_path]

setup.sh creates a python environment and installs the necessary modules in it. Please do not push
your venv directory to the repo.

For tests that modify the database, you will need to put a supabase secret key in your .env file.
Find it in Project Settings -> API Keys
Example:        SUPABASE_SECRET_KEY=sb_secret_**************************

Let me (Kieran) know if you need help running any tests!
