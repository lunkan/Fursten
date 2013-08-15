from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.nodes.views.index', name='index'),
    url(r'^inject', 'fursten.nodes.views.inject', name='inject'),
    url(r'^remove', 'fursten.nodes.views.remove', name='remove'),
    url(r'^set', 'fursten.nodes.views.set', name='set'),
    url(r'^samples', 'fursten.nodes.views.samples', name='samples'),
    
    
    #url(r'^import-export', 'fursten.nodes.views.import_export', name='import_export'),
    
)