from .base import *

DEBUG = False

ALLOWED_HOSTS = ['192.168.1.104']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'taskmanager',
        'USER': 'django',
    }
}

