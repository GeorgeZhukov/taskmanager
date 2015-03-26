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


class TestAngularView(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.login(username='User', password='password')

    def test_page_accessible(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


class TestAPI(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.login(username='User', password='password')

    def test_task_view(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)

    def test_receive_only_for_current_user(self):
        user2 = User.objects.create_user(username='user2', password='password')
        project = Project.objects.create(name='project 2', user=user2)
        Task.objects.create(content='task 1', project=project)

        project2 = Project.objects.create(name='project 1', user=self.user)
        Task.objects.create(content='task 4', project=project2)
        response = self.client.get('/api/projects/')
        self.assertContains(response, 'project 1')
        self.assertNotContains(response, 'project 2')


    def test_unauthorized(self):
        self.client.logout()
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 403)

    def test_create_project_assign_user(self):
        response = self.client.post('/api/projects/', {'name': 'Project 1'})
        project = Project.objects.first()

        #self.assertEqual(project.user, self.user)