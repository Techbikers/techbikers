#!/bin/bash

# install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# set up database
python manage.py migrate --settings=server.settings.local
python manage.py createdummydata --settings=server.settings.local

# create Admin user for Django
echo "Create admin account:"
python manage.py createsuperuser --settings=server.settings.local
