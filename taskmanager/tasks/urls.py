from django.conf.urls import patterns, include, url
from .views import ProjectsView, login_view

urlpatterns = patterns('',
    url(r'^$', ProjectsView.as_view(), name='projects-view'),
    url(r'^login/$', login_view, name='login'),
)
