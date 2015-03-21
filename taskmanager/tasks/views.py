from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from django.contrib.auth import login, authenticate

from braces.views import LoginRequiredMixin

from .models import Project
from .forms import SignupForm, SigninForm, AddProjectForm

# Create your views here.


class ProjectsView(generic.TemplateView):
    template_name = 'tasks/projects.html'

    def get_projects(self):
        return self.request.user.projects.all()

    def get_signup_form(self):
        form = SignupForm()
        return form

    def get_signin_form(self):
        form = SigninForm()
        return form

    def get_addproject_form(self):
        form = AddProjectForm()
        return form