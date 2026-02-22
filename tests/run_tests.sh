# check if the virtual environment exists
if [ ! -d "venv" ]; then
    echo "The python virtual environment has not been created. Please run ./setup.sh first"
    exit 1
fi
source venv/bin/activate

# run a single test
if [ -f "$1" ]; then
    pytest -W 'ignore::DeprecationWarning' -k "user" $1

# run all tests
else
    pytest -W 'ignore::DeprecationWarning' -k "user"
fi

# use the -s flag to keep stdout
