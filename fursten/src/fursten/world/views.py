from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import urllib
import httplib
from django.conf import settings
from fursten.simulator.world_proxy import WorldProxy

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
    
    #worldStatus
    
    if request.method == 'GET':
        
        status, response = WorldProxy().getWorld()
        if status != 200:
            return HttpResponse(status=status)
        else:
            #Tables accept only lists
            respons_data = {
                "worldStatus" : [response]
            }
            return HttpResponse(simplejson.dumps(respons_data), mimetype='application/json')
    
@csrf_protect
def run(request):
    
    #worldStatus
    
    if request.method == 'POST':
        req = urllib2.Request(settings.SIMULATOR_URL + "rest/process/")
        json_data = {}
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
            return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
    