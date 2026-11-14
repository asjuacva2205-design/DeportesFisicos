#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r Backend/requirements.txt
python Backend/manage.py collectstatic --noinput
python Backend/manage.py migrate
