from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
#    url(r'^$', 'fursten.resources.views.index', name='index'),
    url(r'^new', 'fursten.player.views.new', name='new'),
    url(r'^getplayers', 'fursten.player.views.getPlayers', name='getplayers'),
    url(r'^selectplayer', 'fursten.player.views.selectPlayer', name='selectplayer'),
    url(r'^getactiveplayer', 'fursten.player.views.getActivePlayer', name='getactiveplayer'),
)