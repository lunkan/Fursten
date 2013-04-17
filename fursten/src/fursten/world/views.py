from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import urllib
import httplib
from django.conf import settings
from fursten.simulator.world_proxy import WorldProxy
from fursten.simulator.process_proxy import ProcessProxy

def index(request):
    to_json = []
    to_json.append({"name":"opa"});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        
        default_data = {
            "name": "new world",
            "width": 10000,
            "height": 10000
        }
        
        return HttpResponse(simplejson.dumps(default_data), mimetype='application/json')
    
    elif request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        status, response = WorldProxy().newWorld(json_data);
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
    