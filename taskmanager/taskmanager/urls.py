from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    url(r'^', include('tasks.urls', namespace='tasks')),
    (r'^accounts/', include('allauth.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
