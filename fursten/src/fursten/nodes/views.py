from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import httplib
from fursten.utils.requests import RequestWithMethod
from django.conf import settings
import types
from fursten.simulatorproxy.node_proxy import NodeProxy
from fursten.simulatorproxy.proxy import Proxy
from fursten.simulatorproxy.sample_proxy import SampleProxy

def index(request):
    
    #clear nodes
    """if request.method == 'DELETE':
        status, response = NodeProxy().deleteNodes()
        return HttpResponse(status=status)"""

def set(request):
    
    if request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        print json_data
        status, response = NodeProxy().addNodes(json_data)
        return HttpResponse(status=status)
    
def inject(request):
    
    if request.method == 'POST':
        
        print "inject"
        json_data = simplejson.loads(request.raw_post_data)
        transaction_data = {"deleteNodes":[], "injectNodes": json_data['nodes']}
        status, response = NodeProxy().sendTransaction(transaction_data);
        return HttpResponse(status=status)

def remove(request):
    
    if request.method == 'POST':
        print "DELETE nodes"
        json_data = simplejson.loads(request.raw_post_data)
        transaction_data = {"deleteNodes":json_data['nodes'], "injectNodes":[]}
        status, response = NodeProxy().sendTransaction(transaction_data);
        return HttpResponse(status=status)
    
def samples(request):
    
    if request.method == 'POST':
        
        snap = request.GET['snap']
        json_data = simplejson.loads(request.raw_post_data)
        status, response = SampleProxy().getSamples(data=json_data, snap=snap)
        if status != 200:
            return HttpResponse(status=status)
        else:
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        