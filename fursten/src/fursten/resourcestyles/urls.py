from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.resourcestyles.views.index', name='resourcestylesindex'),
    url(r'^(?P<id>[-\w\d]+)/thumbnail/$', 'fursten.resourcestyles.views.thumbnail', name='thumbnail'),
    url(r'^(?P<id>[-\w\d]+)/icon/$', 'fursten.resourcestyles.views.icon', name='icon'),
    url(r'^(?P<id>[-\w\d]+)/$', 'fursten.resourcestyles.views.item', name='resourcestyle'),
)