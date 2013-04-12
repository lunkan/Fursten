from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import httplib
from fursten.utils.requests import RequestWithMethod
from django.conf import settings
import types
from fursten.simulator.node_proxy import NodeProxy
from fursten.simulator.proxy import Proxy
from fursten.simulator.sample_proxy import SampleProxy

def index(request):
    
    #clear nodes
    if request.method == 'DELETE':
        status, response = NodeProxy().deleteNodes()
        return HttpResponse(status=status)

def set(request):
    
    if request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
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
    
@csrf_protect
def import_export(request):

    if request.method == 'GET':
        print "GET nodes export"
        
        status, response = NodeProxy(Proxy.MimeType.PROTOBUF).getNodes()
        file = response.SerializeToString()
        return HttpResponse(file, mimetype=Proxy.MimeType.PROTOBUF)
    
    if request.method == 'POST':
        data = request.FILES['nodes-file'].read()
        status, response = NodeProxy(Proxy.MimeType.PROTOBUF).replaceNodes(data=data)
        return HttpResponse(status=status)
    
def samples(request):
    
    if request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        status, response = SampleProxy().getSamples(data=json_data, prospecting=json_data['prospecting'])
        if status != 200:
            return HttpResponse(status=status)
        else:
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        