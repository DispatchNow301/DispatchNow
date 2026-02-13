To run tests do:

./setup.sh
./run_tests.sh [test_path]

This creates a python environment and installs pytest in it, then runs the
tests using pytest. You should only need to run setup.sh once ever, unless
more packages are added to requirements.txt. Please do not push your venv
directory to the repo.