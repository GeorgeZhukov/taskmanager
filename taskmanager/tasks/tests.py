from django.test import TestCase
from django.contrib.auth.models import User

from datetime import datetime

from .models import Task, Project
# Create your tests here.


def create_test_user():
    return User.objects.create_user(username='User', email='mail@example.com', password='password')


class TestModels(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.project = Project.objects.create(name='Project #1', user=self.user)
        self.object = Task.objects.create(content='Task #1', deadline=datetime.now(), project=self.project)

    def test_task_str(self):
        self.assertEqual(self.object.__str__(), 'Task #1')

    def test_project_str(self):
        self.assertEqual(self.project.__str__(), 'Project #1')
