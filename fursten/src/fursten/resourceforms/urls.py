from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.resourceforms.views.index', name='index'),
    url(r'^(?P<id>[-\w\d]+)/$', 'fursten.resourceforms.views.item', name='item'),
)