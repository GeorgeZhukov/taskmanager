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


class TestViews(TestCase):
    def setUp(self):
        self.user = create_test_user()
        self.client.login(username='User', password='password')

    def test_projects_view_page_accessible(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_login_redirect(self):
        self.client.logout()
        response = self.client.get('/')
        self.assertRedirects(response, '/accounts/login/?next=/')

    def test_add_project_assign_to_user(self):
        response = self.client.post('/add/', {'name': 'Project 1'})
        project = Project.objects.first()
        self.assertEqual(project.user, self.user)

    def test_update_wrong_project_raises_404(self):
        response = self.client.post('/4/update/', {'name': 'Project Z'})
        self.assertEqual(response.status_code, 404)

    def test_add_task_to_wrong_project(self):
        response = self.client.post('/4/task/add/', {'content': 'content', 'deadline': '2010-10-10 10:10:10'})
        self.assertEqual(response.status_code, 404)

    def test_delete_wrong_task(self):
        Project.objects.create(name='Project 1', user=self.user)
        response = self.client.post('/1/task/5/delete/', {})
        self.assertEqual(response.status_code, 404)

    def test_add_task_to_project(self):
        project = Project.objects.create(name='Project 1', user=self.user)
        response = self.client.post('/1/task/add/', {'content': 'Task 1', 'deadline': '2010-10-10 10:10:10'})
        task = Task.objects.first()
        self.assertEqual(task.content, 'Task 1')

    def test_delete_project(self):
        project = Project.objects.create(name='Project 1', user=self.user)
        response = self.client.post('/1/delete/', {})
        self.assertFalse(Project.objects.exists())

    def test_delete_wrong_project(self):
        response = self.client.post('/1/delete/', {})
        self.assertEqual(response.status_code, 404)

    def test_update_task(self):
        project = Project.objects.create(name='Project #1', user=self.user)
        task = Task.objects.create(content='Task #1', deadline=datetime.now(), project=project)
        response = self.client.post('/1/task/1/update/', {'content': 'Task #2', 'deadline': '2010-10-10 10:10:10'})
        task = Task.objects.first()
        self.assertEqual(task.content, 'Task #2')
