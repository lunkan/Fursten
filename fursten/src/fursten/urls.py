from django.conf.urls import patterns, include, url
#from fursten import settings
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'fursten.views.index', name='index'),
    url(r'^index$', 'fursten.views.index', name='index'),
    url(r'^login$', 'fursten.views.login', name='login'),
    url(r'^logout$', 'fursten.views.logout', name='logout'),
    url(r'^dashboard/', include('fursten.dashboard.urls', namespace='dashboard')),
    url(r'^world/', include('fursten.world.urls', namespace='world')),
    url(r'^resource/', include('fursten.resources.urls', namespace='resources')),
    url(r'^diagram/', include('fursten.diagram.urls', namespace='diagram')),
    url(r'^node/', include('fursten.nodes.urls', namespace='nodes')),
    
    #url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_DOC_ROOT}),
    #url(r'^$', 'fursten.views.index', name='index'),
    # url(r'^$', 'fursten.views.home', name='home'),
    # url(r'^fursten/', include('fursten.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls))
)