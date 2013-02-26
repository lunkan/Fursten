from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import datetime
from fursten.resources.forms import ResourceForm
import urllib2
import urllib
import httplib
from fursten.utils.requests import RequestWithMethod
from django.conf import settings

def index(request):
    
    if request.method == 'GET':
        print "GET nodes"
        #from django.conf import settings
        
    elif request.method == 'DELETE':
        print "DELETE nodes"
        
        url = settings.SIMULATOR_URL + "rest/nodes"
        req = RequestWithMethod(url, 'DELETE')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            print e
            to_json = {'error': 'Unable to save resource on server.'}
        except urllib2.URLError, e:
            print 'URLError = ' + str(e.reason)
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            print 'HTTPException'
            to_json = {'error': 'HTTPException.'}
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)

def inject(request):
    
    if request.method == 'POST':
        
        url = settings.SIMULATOR_URL + "rest/nodes/inject"
        json_data = simplejson.loads(request.raw_post_data)
        
        print json_data
    
        req = urllib2.Request(url)
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            print e
            to_json = {'error': 'Unable to save resource on server.'}
        except urllib2.URLError, e:
            print 'URLError = ' + str(e.reason)
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            print 'HTTPException'
            to_json = {'error': 'HTTPException.'}
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)

def remove(request):
    
    if request.method == 'POST':
        print "DELETE nodes"
        url = settings.SIMULATOR_URL + "rest/nodes/remove"
        json_data = simplejson.loads(request.raw_post_data)
        
        print json_data
    
        req = urllib2.Request(url)
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            print e
            to_json = {'error': 'Unable to save resource on server.'}
        except urllib2.URLError, e:
            print 'URLError = ' + str(e.reason)
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            print 'HTTPException'
            to_json = {'error': 'HTTPException.'}
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
    
def set(request):
    
    if request.method == 'POST':
        
        url = settings.SIMULATOR_URL + "rest/nodes"
        json_data = simplejson.loads(request.raw_post_data)
        
        print json_data
    
        req = RequestWithMethod(url, 'PUT')
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            print e
            to_json = {'error': 'Unable to save resource on server.'}
        except urllib2.URLError, e:
            print 'URLError = ' + str(e.reason)
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            print 'HTTPException'
            to_json = {'error': 'HTTPException.'}
        except Exception:
            print 'Exception'
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)