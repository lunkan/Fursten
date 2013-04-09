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
import types
from fursten.nodes import node_pb2

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
        
        response = HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)
        response['Pragma'] = 'no-cache'
        response['Cache-Control'] = 'no-cache'
        return response
        #HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=e.code)

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
        
        #print json_data
    
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
    
def samples(request):
    
    if request.method == 'POST':
        
        url = settings.SIMULATOR_URL + "rest/samples"
        json_data = simplejson.loads(request.raw_post_data)
        
        #print json_data
    
        req = RequestWithMethod(url, 'POST')
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        
        try:
            f = urllib2.urlopen(req)
            respond_data = simplejson.loads(f.read())
            
            #if one item wrap as list
            if not isinstance(respond_data['samples'], types.ListType):
                respond_data['samples'] = [respond_data['samples']]
            
            return HttpResponse(simplejson.dumps(respond_data), mimetype='application/json')
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
    
@csrf_protect
def import_export(request):

    if request.method == 'GET':
        print "GET nodes export"
        
        url = settings.SIMULATOR_URL + "rest/nodes/"
        req = urllib2.Request(url)
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/x-protobuf')
    
        try:
            f = urllib2.urlopen(req)
            data = f.read()
            f.close()
            node_collection = node_pb2.NodeCollection()
            #print data
            print "1"
            node_collection.ParseFromString(data)
            #node_collection.ParseFromString(open('foo.desc', 'rb').read()) 
            print "2"
            
            print data
            print "3"
            
            for node in node_collection.nodes:
                try:
                    print node
                except Exception as e:
                    print e
            
            print "4"
            
            send_data = node_collection.SerializeToString() 
            req = RequestWithMethod(url, 'PUT')
            req.add_data(send_data)
            req.add_header('Content-Type', 'application/x-protobuf')
            req.add_header('Accept', 'application/x-protobuf')
            
            try:
                f = urllib2.urlopen(req)
                data = f.read()
                f.close()
                node_collection = node_pb2.NodeCollection()
                node_collection.ParseFromString(data)
            
                for node in node_collection.nodes:
                    try:
                        print node
                    except Exception as e:
                        print e
                
            except Exception as e:
                print e
    
        except Exception as e:
            print e
                
        file = node_collection.SerializeToString()
        return HttpResponse(file, mimetype='application/x-protobuf')
    
    if request.method == 'POST':
        print "POST nodes import"
        return HttpResponse(status=200)