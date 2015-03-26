# Task Manager
Simple Task Manger written on django and AngularJS.


# Installation


Clone repo...

    git clone https://github.com/GeorgeZhukov/taskmanager.git
    cd taskmanager/
    
Add virtual environment...
  
    virtualenv venv && . venv/bin/activate
    
Install requirements...
    
    pip install -r requirements/local.txt
    cd taskmanager/
    
Syncd database...

    python manage.py syncdb
    
Run server...

    python manage.py runserver

# Unit tests

## Back-End
To run unit tests with coverage...

    ./tests_coverage.sh

or

    coverage run --source='.' manage.py test
    coverage html

after open **htmlcov/index.html** report in browser

## Front-End
    
# TODO
- ~~Add js framework like AngularJS, Backbone, or something else...~~
- Add unit tests
