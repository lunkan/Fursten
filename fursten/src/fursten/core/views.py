from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

from django.template import Context, loader
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse

from fursten.core import signals, receivers
from fursten.core.blocks import *
from fursten.resources import receivers

def index(request):
    #latest_poll_list = Poll.objects.order_by('-pub_date')[:5]
    #template = loader.get_template('core/main.html')
    #context = Context({
    #    'head': '6',
    #})
    #return HttpResponse(template.render(context))
    #return HttpResponse("hej du glade")
    #return render(request, '/fursten/template/main.html', {'poll': 'klara'})
    
    #if request.user.is_authenticated():
    #    signals.user_login.send(sender=None, request=request, user=request.user)
    #return render(request, 'core/main.html', {'poll': 'klara'})
    
    head = Head('core/head.html', request)
    header = Header('core/header.html', request)
    left_sidebar = Sidebar('core/sidebar.html', request)
    
    signals.initialize.send(sender=None, page={'head':head, 'header':header, 'left_sidebar': left_sidebar}, request=request, user=None)
    
    return render(request, 'core/main.html', {'head': head, 'header': header, 'left_sidebar': left_sidebar})