from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.simulator.views.index', name='index'),
    url(r'^status', 'fursten.simulator.views.status', name='status'),
    url(r'^run', 'fursten.simulator.views.run', name='run'),
    url(r'^clean', 'fursten.simulator.views.clean', name='clean'),
    url(r'^clearnodes', 'fursten.simulator.views.clearnodes', name='clearnodes'),
)