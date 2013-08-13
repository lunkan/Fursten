from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.project.views.index', name='index'),
    url(r'^new', 'fursten.project.views.newproject', name='newproject'),
    url(r'^save', 'fursten.project.views.saveproject', name='saveproject'),
    url(r'^load', 'fursten.project.views.loadproject', name='loadproject'),
    url(r'^import/resource$', 'fursten.project.views.importresource'),
    url(r'^export/resource$', 'fursten.project.views.exportresource'),
    url(r'^import/node$', 'fursten.project.views.importnode'),
    url(r'^export/node$', 'fursten.project.views.exportnode'),
)