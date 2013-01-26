from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

from django.template import Context, loader
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse

from django.contrib.auth.decorators import login_required

from fursten.dashboard import signals, receivers
from fursten.dashboard.blocks import *
from fursten.resources import receivers
from fursten.world import receivers
from fursten.diagram import receivers

@login_required(login_url='/index?error=forbidden')
def index(request):
    
    head = Head('dashboard/head.html', request)
    header = Header('dashboard/header.html', request)
    left_sidebar = Sidebar('dashboard/sidebar.html', request)
     
    signals.initialize.send(sender=None, page={'head':head, 'header':header, 'left_sidebar': left_sidebar}, request=request, user=request.user)
    return render(request, 'dashboard/base.html', {'head': head, 'header': header, 'left_sidebar': left_sidebar})