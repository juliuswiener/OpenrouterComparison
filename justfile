# OpenRouter Dashboard - Justfile

# Run the Flask development server
run:
    ./run.sh

# Serve the application (synonym for run)
serve:
    ./run.sh

# Install dependencies
install:
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt

# Clean up virtual environment and cache files
clean:
    rm -rf venv
    rm -rf __pycache__
    find . -type f -name "*.pyc" -delete
    find . -type d -name "__pycache__" -delete

# Run with production server (gunicorn)
prod:
    ./venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 server:app
