from django.conf.urls import patterns, include, url
from .views import ProjectsView

urlpatterns = patterns('',
    url(r'^$', ProjectsView.as_view(), name='projects-view'),
)
