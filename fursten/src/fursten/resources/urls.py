from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.resources.views.index', name='index'),
    url(r'^new', 'fursten.resources.views.new', name='new'),
)