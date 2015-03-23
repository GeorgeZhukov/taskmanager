from django.conf.urls import patterns, include, url

from .views import ProjectsView, AddProjectView, DeleteProjectView, UpdateProjectView, AddTaskView, UpdateTaskView, \
    DeleteTaskView

urlpatterns = patterns('',
    url(r'^$', ProjectsView.as_view(), name='projects-view'),
    url(r'^add/$', AddProjectView.as_view(), name='add-project'),
    url(r'^(?P<project_pk>\d+)/delete/$', DeleteProjectView.as_view(), name='delete-project'),
    url(r'^(?P<project_pk>\d+)/update/$', UpdateProjectView.as_view(), name='update-project'),
    url(r'^(?P<project_pk>\d+)/task/add/$', AddTaskView.as_view(), name='add-task'),
    url(r'^(?P<project_pk>\d+)/task/(?P<task_pk>\d+)/update/$', UpdateTaskView.as_view(), name='update-task'),
    url(r'^(?P<project_pk>\d+)/task/(?P<task_pk>\d+)/delete/$', DeleteTaskView.as_view(), name='delete-task'),
)
