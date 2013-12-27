from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
from fursten.resourcelist.models import ResourceLayer
from fursten.resourcestyles.models import ResourceStyle
from django.conf import settings
from PIL import Image, ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from fursten.simulatorproxy.resource_proxy import ResourceProxy
from fursten.simulatorproxy.proxy import Proxy
from fursten.utils.graphics import hex_to_rgb

#@never_cache

@csrf_protect
def index(request):
    
    if request.method == 'GET':
        
        name_query = request.GET.get('qname', '').lower()
        max_item = request.GET.get('max', '')
        
        status, response = ResourceProxy().getResources()
        if status != 200:
            return HttpResponse(status=status)
        
        #Return all or filter by name query
        if name_query is None:
            response = HttpResponse(simplejson.dumps(response['resources']), mimetype='application/json')
            return response
        else:
            search_result = []
            for resource in response['resources']:
                if resource['name'].lower().find(name_query) != -1:
                    search_result.append(resource)
                    if max_item is not None and max_item <= search_result.count:
                        break
            
            search_result.sort(key = lambda w: w['name'].lower())
            return HttpResponse(simplejson.dumps(search_result), mimetype='application/json')
    
    #Create new root resource
    if request.method == 'POST':
        data = simplejson.loads(request.raw_post_data)
        print data
        status, response = ResourceProxy().addResource(data)
        return HttpResponse(status=status)
        
    """elif request.method == 'DELETE':
        resource_key = request.GET['filter'];
        
        #delete all if no key is provided
        if resource_key is not None:
            status, response = ResourceProxy().deleteResource(resource_key)
        else:
            status, response = ResourceProxy().deleteResources()
        
        return HttpResponse(status=status)"""
    
@csrf_protect
def item(request, id):
    
    #Get a resource instance by key
    if request.method == 'GET':
        status, response = ResourceProxy().getResource(id)
        if status != 200:
            return HttpResponse(status=status)
        else:
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    
    #Extend a resource from key
    elif request.method == 'POST':
        json_data = simplejson.loads(request.raw_post_data)
        status, response = ResourceProxy().addResource(json_data, id)
        return HttpResponse(status=status)
    
    #Update a resource by key
    elif request.method == 'PUT':
        json_data = simplejson.loads(request.raw_post_data)
        status, response = ResourceProxy().replaceResource(json_data, id)
        return HttpResponse(status=status)
    
    #Delete a resource by key
    elif request.method == 'DELETE':
        print "delete " + id
        status, response = ResourceProxy().deleteResource(id)
        return HttpResponse(status=status)
    
"""@csrf_protect
def import_export(request):

    if request.method == 'GET':
        status, response = ResourceProxy(Proxy.MimeType.PROTOBUF).getResources(details=True)
        file = response.SerializeToString()
        return HttpResponse(file, mimetype=Proxy.MimeType.PROTOBUF)
    
    if request.method == 'POST':
        data = request.FILES['resource-file'].read()
        status, response = ResourceProxy(Proxy.MimeType.PROTOBUF).replaceResources(data)
        return HttpResponse(status=status)"""
    