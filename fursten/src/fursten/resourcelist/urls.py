'''
Created on 5 aug 2013

@author: Jonas
'''
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'fursten.resourcelist.views.index', name='resourcelistindex'),
    url(r'^(?P<id>[-\w\d]+)/$', 'fursten.resourcelist.views.item', name='resourcelistitem'),
)