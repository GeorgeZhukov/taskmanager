from django.views import generic

from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Project, Task

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


class AngularView(generic.TemplateView):
    template_name = 'tasks/angular.html'