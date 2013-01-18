from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import urllib

def index(request):
    to_json = []
    to_json.append({"name":"opa"});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        req = urllib2.Request("http://127.0.0.1:8989/Fursten-simulator/rest/instance/")
        f = urllib2.urlopen(req)
        to_json = simplejson.loads(f.read())
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    elif request.method == 'POST':
        url="http://127.0.0.1:8989/Fursten-simulator/rest/instance/"
        json_data = simplejson.loads(request.raw_post_data)
        req = urllib2.Request(url)
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        f = urllib2.urlopen(req)
        to_json = simplejson.loads(f.read())
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    