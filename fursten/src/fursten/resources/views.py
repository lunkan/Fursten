from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import datetime
from fursten.resources.forms import ResourceForm
from fursten.resources.models import ResourceLayer
import urllib2
import urllib
import httplib
from fursten.utils.requests import RequestWithMethod
from django.conf import settings
import types

def index(request):
    
    if request.method == 'GET':
        print "GET index"
        
        #todo:implement cache
        url = settings.SIMULATOR_URL + "rest/resources/"
        req = urllib2.Request(url)
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            json_data = simplejson.loads(f.read())
            resource_layers = []
            if 'resourceIndex' in json_data:
                
                #if one item wrap as list
                if not isinstance(json_data['resourceIndex'], types.ListType):
                    json_data['resourceIndex'] = [json_data['resourceIndex']]
                
                for resource in json_data['resourceIndex']:
                    
                    try :
                        resource_layer = ResourceLayer.objects.get(resource=resource['key'])
                        resource['isDisplayed'] = resource_layer.display
                        resource['isRendered'] = resource_layer.render
                        resource_layers.append(resource_layer);
                    except :
                        resource['isDisplayed'] = False
                        resource['isRendered'] = False
                        pass
            
            #make sure deleted is removed
            #todo: improve!
            ResourceLayer.objects.all().delete()
            for updatedResourceLayer in resource_layers:
                resource_layer = ResourceLayer(resource=updatedResourceLayer.resource, render=updatedResourceLayer.render, display=updatedResourceLayer.display)
                resource_layer.save()
            
            return HttpResponse(simplejson.dumps(json_data), mimetype='application/json')
        
        except urllib2.HTTPError, e:
            to_json = {'error': 'HTTPError.'}
        except urllib2.URLError, e:
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            to_json = {'error': 'HTTPException.'}
        except Exception:
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
    
    #post current filter settings (render, delete)
    elif request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        for resource in json_data['resourceIndex']:
            try :
                resource_layer = ResourceLayer.objects.get(resource=resource['key'])
                resource_layer.render = resource['isRendered']
                resource_layer.display = resource['isDisplayed']
                resource_layer.save()
            except :
                resource_layer = ResourceLayer(resource=resource['key'], render=resource['isRendered'], display=resource['isDisplayed'])
                resource_layer.save()
                pass
        
        return HttpResponse(status=200)
        
    elif request.method == 'DELETE':
        filter_arg = request.GET['filter'];
        if(filter_arg):
            print "delete it all " + filter_arg
            url = settings.SIMULATOR_URL + "rest/resources?filter="+filter_arg;
        else:
            url = settings.SIMULATOR_URL + "rest/resources/"
        
        req = RequestWithMethod(url, 'DELETE')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            urllib2.urlopen(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            to_json = {'error': 'HTTPError.'}
        except urllib2.URLError, e:
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            to_json = {'error': 'HTTPException.'}
        except Exception:
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
        
def search(request):
    
    response = []
    term = request.GET.get('term', '').lower()
    
    #todo:implement cache
    url = settings.SIMULATOR_URL + "rest/resources/"
    req = urllib2.Request(url)
    req.add_header('Content-Type', 'application/json')
    req.add_header('Accept', 'application/json')
    
    try:
        f = urllib2.urlopen(req)
        json_data = simplejson.loads(f.read());
    except Exception:
        return HttpResponse(status=400)
    
    if 'resourceIndex' in json_data:
                
        #if one item wrap as list
        if not isinstance(json_data['resourceIndex'], types.ListType):
            json_data['resourceIndex'] = [json_data['resourceIndex']]
                    
        for resource in json_data['resourceIndex']:
            if resource['name'].lower().find(term) != -1:
                response.append(resource['name'])
    
    response.sort()
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        
        to_json = {
            'name': 'New Resourcing',
            'threshold': 100,
            'offsprings': [{'resource':14,'value':1}],
            'weightGroups': [{'weights':[{'resource':12,'value':35,'group':1},{'resource':11,'value':37,'group':2}]},{'weights':[{'resource':12,'value':35,'group':1}]}]
        }
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    elif request.method == 'POST':
        url = settings.SIMULATOR_URL + "rest/resources/"
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
        
    elif request.method == 'PUT':
        print "put"
        
@csrf_protect
def item(request, id):
    
    if request.method == 'GET':
        print "GET item:"+id
        url = settings.SIMULATOR_URL + "rest/resources/"+id+"/"
        req = urllib2.Request(url)
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            json_data = simplejson.loads(f.read());
            return HttpResponse(simplejson.dumps(json_data), mimetype='application/json')
        except urllib2.HTTPError, e:
            to_json = {'error': 'HTTPError.'}
        except urllib2.URLError, e:
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            to_json = {'error': 'HTTPException.'}
        except Exception:
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
    
    elif request.method == 'POST':
        #print "POST item:"+id
        #return HttpResponse(status=200)
        
        url = settings.SIMULATOR_URL + "rest/resources/"+id+"/"
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
        
    elif request.method == 'PUT':
        print "put"
        url = settings.SIMULATOR_URL + "rest/resources/"+id+"/"
        print "url " + url
        
        #req = RequestWithMethod(url, 'PUT')
        
        json_data = simplejson.loads(request.raw_post_data)
        
        opener = urllib2.build_opener(urllib2.HTTPHandler)
        req = urllib2.Request(url, data=simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        req.get_method = lambda: 'PUT'
        #url = opener.open(request)

        try:
            #urllib2.urlopen(req)
            opener.open(req)
            return HttpResponse(status=200)
        except urllib2.HTTPError, e:
            to_json = {'error': 'HTTPError.'}
        except urllib2.URLError, e:
            to_json = {'error': 'URLError.'}
        except httplib.HTTPException, e:
            to_json = {'error': 'HTTPException.'}
        except Exception:
            to_json = {'error': 'Exception.'}
        
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
    