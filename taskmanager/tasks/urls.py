from django.conf.urls import patterns, include, url

from .views import AngularView

urlpatterns = patterns('',
     url(r'^$', AngularView.as_view()),
)
