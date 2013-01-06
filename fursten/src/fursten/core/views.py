from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

from django.template import Context, loader
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse

from fursten.core import signals, receivers
from fursten.core.blocks import *
from fursten.resources import receivers
from fursten.world import receivers

def index(request):
    head = Head('core/head.html', request)
    header = Header('core/header.html', request)
    left_sidebar = Sidebar('core/sidebar.html', request)
    
    signals.initialize.send(sender=None, page={'head':head, 'header':header, 'left_sidebar': left_sidebar}, request=request, user=None)
    return render(request, 'core/main.html', {'head': head, 'header': header, 'left_sidebar': left_sidebar})