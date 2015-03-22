from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    url(r'^', include('tasks.urls', namespace='tasks')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
