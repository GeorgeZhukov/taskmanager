# Task Manager
Simple Task Manger written on django.


# Installation


Clone repo...

    git clone https://github.com/GeorgeZhukov/taskmanager.git
    cd taskmanager/
    
Add virtual environment...
  
    virtualenv venv && . venv/bin/activate
    
Install requirements...
    
    pip install -r requiremenets/local.txt
    cd taskmanager/
    
Syncd database...

    python manage.py syncdb
    
Run server...

    python manage.py runserver


# TODO
1. Add js framework like AngularJS, Backbone, or something else...