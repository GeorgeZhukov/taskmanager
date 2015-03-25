from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.views import generic
from django.core.urlresolvers import reverse_lazy

from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from braces.views import LoginRequiredMixin

from .models import Project, Task
from .forms import TaskForm, LoginForm

# Create your views here.


# Serializers define the API representation.
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'project', 'content', 'deadline', 'done', )


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'user', 'name', 'tasks', )


# ViewSets define the view behavior.
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def create(self, request, *args, **kwargs):
        result = super(ProjectViewSet, self).create(request, *args, **kwargs)
        result.user = request.user
        return result


class LoginView(APIView):
    def post(self, request, format=None):
        form = LoginForm(request.DATA, commit=False)
        isq = form.is_valid()
        i = 5


class ToggleTaskStatus(LoginRequiredMixin, generic.TemplateView):

    def get(self, request, *args, **kwargs):
        try:
            task = Task.objects.get(pk=self.kwargs['task_pk'], project__user=self.request.user)
        except Task.DoesNotExist:
            raise Http404
        task.done = not task.done
        task.save()
        return HttpResponse('changed')


class ProjectsView(LoginRequiredMixin, generic.ListView):
    template_name = 'tasks/projects.html'
    model = Project
    context_object_name = 'projects'

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class AddProjectView(LoginRequiredMixin, generic.CreateView):
    fields = ['name', ]
    template_name = 'tasks/add_project.html'
    model = Project
    success_url = reverse_lazy('tasks:projects-view')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(AddProjectView, self).form_valid(form)


class DeleteProjectView(LoginRequiredMixin, generic.DeleteView):
    model = Project
    success_url = reverse_lazy('tasks:projects-view')
    template_name = 'tasks/delete_project.html'

    def get_object(self, queryset=None):
        try:
            project = Project.objects.get(pk=self.kwargs['project_pk'], user=self.request.user)
        except Project.DoesNotExist:
            raise Http404
        return project


class UpdateProjectView(LoginRequiredMixin, generic.UpdateView):
    fields = ['name', ]
    model = Project
    success_url = reverse_lazy('tasks:projects-view')
    template_name = 'tasks/update_project.html'

    def get_object(self, queryset=None):
        try:
            project = Project.objects.get(pk=self.kwargs['project_pk'], user=self.request.user)
        except Project.DoesNotExist:
            raise Http404
        return project


class AddTaskView(LoginRequiredMixin, generic.CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/add_task.html'
    success_url = reverse_lazy('tasks:projects-view')

    def form_valid(self, form):
        try:
            project = Project.objects.get(pk=self.kwargs['project_pk'], user=self.request.user)
        except Project.DoesNotExist:
            raise Http404

        form.instance.project = project
        return super(AddTaskView, self).form_valid(form)


class UpdateTaskView(LoginRequiredMixin, generic.UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'tasks/update_task.html'
    success_url = reverse_lazy('tasks:projects-view')

    def get_object(self, queryset=None):
        try:
            task = Task.objects.get(pk=self.kwargs['task_pk'], project__user=self.request.user)
        except Task.DoesNotExist:
            raise Http404
        return task


class DeleteTaskView(LoginRequiredMixin, generic.DeleteView):
    model = Task
    template_name = 'tasks/delete_task.html'
    success_url = reverse_lazy('tasks:projects-view')

    def get_object(self, queryset=None):
        try:
            task = Task.objects.get(pk=self.kwargs['task_pk'], project__user=self.request.user)
        except Task.DoesNotExist:
            raise Http404
        return task


class AngularView(generic.TemplateView):
    template_name = 'tasks/angular.html'