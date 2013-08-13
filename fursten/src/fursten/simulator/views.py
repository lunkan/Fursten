from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import urllib
import httplib
from django.conf import settings
from fursten.simulatorproxy.world_proxy import WorldProxy
from fursten.simulatorproxy.process_proxy import ProcessProxy
from fursten.simulatorproxy.node_proxy import NodeProxy

def index(request):
    to_json = []
    to_json.append({"name":"opa"});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')

@csrf_protect
def clearnodes(request):

    if request.method == 'POST':
        status, response = NodeProxy().deleteNodes()
        return HttpResponse(status=status)

@csrf_protect
def status(request):
    
    if request.method == 'GET':
        
        status, response = WorldProxy().getWorld()
        print "status: ", status
        if status != 200:
            return HttpResponse(status=status)
        else:
            print "status: ", status
            #Tables accept only lists
            respons_data = {
                "worldStatus" : [response]
            }
            return HttpResponse(simplejson.dumps(respons_data), mimetype='application/json')
    
@csrf_protect
def run(request):
    
    if request.method == 'POST':
        
        status, response = ProcessProxy().run()
        return HttpResponse(status=status);
    
@csrf_protect
def clean(request):
    
    if request.method == 'POST':
        
        status, response = ProcessProxy().clean()
        return HttpResponse(status=status);
    