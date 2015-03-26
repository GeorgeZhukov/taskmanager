from django.views import generic

from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from braces.views import LoginRequiredMixin

from .models import Project, Task
from .forms import TaskForm, ProjectForm

# Create your views here.


# Serializers define the API representation.
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'project', 'content', 'deadline', 'done', )


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    def save(self, **kwargs):
        result = super(ProjectSerializer, self).save(**kwargs)
        result.user = self.context['request'].user
        return result

    class Meta:
        model = Project
        fields = ('id', 'user', 'name', 'tasks', )
        read_only_fields = ('user', )


# ViewSets define the view behavior.
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(project__user=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class AngularView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'tasks/angular.html'

    def get_context_data(self, **kwargs):
        context = super(AngularView, self).get_context_data(**kwargs)
        context.update(task_form=TaskForm())
        context.update(project_form=ProjectForm(form_name='edit_project'))
        context.update(add_project_form=ProjectForm(form_name='add_project'))
        # context.update()

        return context