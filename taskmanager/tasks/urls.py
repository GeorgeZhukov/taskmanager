from django.conf.urls import patterns, include, url

from .views import HomeView
from .models import Project, Task
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    

    class Meta:
        model = Project
        fields = ('name', )


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('project', 'content', 'deadline', )


# ViewSets define the view behavior.
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter()


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(project__user=self.request.user)

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, 'Projects')
router.register(r'tasks', TaskViewSet, 'Tasks')

urlpatterns = patterns('',
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^api/', include(router.urls)),
)
