# check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "python3 command not found. Please install Python"
    exit 1
fi

# check if the python virtual environment module is installed
if ! python3 -m venv --help &> /dev/null; then
    echo "Python venv module not found. please run: sudo apt install python3-venv"
    exit 1
fi

# check if the venv directory already exists
if [ ! -d "venv" ]; then
    echo "Creating a python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "Setup complete! Run the tests with ./run_tests.sh [test_path]"
