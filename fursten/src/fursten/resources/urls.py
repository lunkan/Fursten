from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.resources.views.index', name='index'),
    url(r'^new', 'fursten.resources.views.new', name='new'),
    url(r'^search', 'fursten.resources.views.search', name='search'),
    url(r'^import-export', 'fursten.resources.views.import_export', name='import_export'),
    url(r'^(?P<id>[-\w\d]+)/style/$', 'fursten.resources.views.style', name='style'),
    url(r'^(?P<id>[-\w\d]+)/thumbnail/$', 'fursten.resources.views.thumbnail', name='thumbnail'),
    url(r'^(?P<id>[-\w\d]+)/icon/$', 'fursten.resources.views.icon', name='icon'),
    url(r'^(?P<id>[-\w\d]+)/$', 'fursten.resources.views.item', name='item'),
)