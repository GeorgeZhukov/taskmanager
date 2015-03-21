from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from django.contrib.auth import login, authenticate

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


def login_view(request):
    if request.method == 'POST':
        username, password = request.POST['username'], request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                # Redirect to a success page.
                return HttpResponse('Ok')
            else:
                # Return a 'disabled account' error message
                return HttpResponse('Disabled account')
        else:
            # Return an 'invalid login' error message.
            return HttpResponse('Invalid login')

    return HttpResponse('')
