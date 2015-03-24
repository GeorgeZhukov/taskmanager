from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from tasks.views import ProjectViewSet, TaskViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'projects', ProjectViewSet)


urlpatterns = patterns('',
    url(r'^', include('tasks.urls', namespace='tasks')),
    (r'^accounts/', include('allauth.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
