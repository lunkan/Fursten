from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import urllib2
import urllib
import httplib
from django.conf import settings

def index(request):
    to_json = []
    to_json.append({"name":"opa"});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        req = urllib2.Request(settings.SIMULATOR_URL + "rest/instance/")
        f = urllib2.urlopen(req)
        to_json = simplejson.loads(f.read())
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    elif request.method == 'POST':
        
        url = settings.SIMULATOR_URL + "rest/instance/"
        json_data = simplejson.loads(request.raw_post_data)
        req = urllib2.Request(url)
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
    
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            to_json = {'error': 'Unable to save resource on server.'}
            return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
        except urllib2.URLError, e:
            print 'URLError = ' + str(e.reason)
            to_json = {'error': 'URLError.'}
            return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
        except httplib.HTTPException, e:
            print 'HTTPException'
            to_json = {'error': 'HTTPException.'}
            return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
            return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
    
    