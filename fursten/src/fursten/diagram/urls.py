'''
Created on 20 jan 2013

@author: Olof Manbo
'''
from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^getsvgjson$', 'fursten.diagram.views.getSvgJson', name='getsvgjson'),
    url(r'^getcss$', 'fursten.diagram.views.getCss', name='getcss'),
    url(r'^connecttosimulator/$', 'fursten.diagram.views.connectToSimulator', name='connecttosimulator'),
)

