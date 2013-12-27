'''
Created on 5 aug 2013

@author: Jonas
'''
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
from math import log
from random import randint

#@never_cache
def get_indent_by_key(v):
    bit = 0
    indent = 0
    while(bit < 32):
        if v & (10 ^ (1 << bit)):
            indent += 1
        bit += 1
    
    return (indent -1)

def sort_by_key(o):
    return int(o['key'])
    
def index(request):
    
    #Fetch the entire resource-list
    if request.method == 'GET':
        print "GET resourcelist index"
        
        status, response = ResourceProxy().getResources()
        if status != 200:
            return HttpResponse(status=status)
            
        resource_layers = []
        
        #Append data from interface (fursten)
        try:
            for resource in response['resources']:
                
                key_int = int(resource['key'])
                
                
                resource['indent'] = get_indent_by_key(key_int)
                resource['icon'] = '/resourcestyle/'+ str(key_int) +'/symbol/26/?v=' + str(randint(1,9999))
                
                #merge with render-filter
                try :
                    resource_layer = ResourceLayer.objects.get(resource=resource['key'])
                    resource['isDisplayed'] = resource_layer.display
                    resource['isRendered'] = resource_layer.render
                    resource['isRiver'] = resource_layer.river
                    resource_layers.append(resource_layer);
                except :
                    resource['isDisplayed'] = False
                    resource['isRendered'] = False
                    resource['isRiver'] = False
                    pass
        except:
            response = {
                'resources':[]
            }
        
        list.sort(response['resources'], key=sort_by_key)
        
        #Update resource layers
        #todo: improve!
        ResourceLayer.objects.all().delete()
        for updatedResourceLayer in resource_layers:
            resource_layer = ResourceLayer(resource=updatedResourceLayer.resource, 
                                           render=updatedResourceLayer.render, 
                                           display=updatedResourceLayer.display,
                                           river=updatedResourceLayer.river)
            resource_layer.save()
        
        #response = HttpResponse(simplejson.dumps(response), mimetype='application/json')
        response = HttpResponse(simplejson.dumps(response['resources']), mimetype='application/json')
        response['Pragma'] = 'no-cache'
        response['Cache-Control'] = 'no-cache'
        return response
    
@csrf_protect
def item(request, id):
    
    #Get a single resource list item
    if request.method == 'GET':
        """status, response = ResourceProxy().getResource(id)
        if status != 200:
            return HttpResponse(status=status)
        else:
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')"""
    
    #Update a single resource list items filter settings
    elif request.method == 'PUT':
        json_data = simplejson.loads(request.raw_post_data)
        try :
            resource_layer = ResourceLayer.objects.get(resource=json_data['key'])
            resource_layer.render = json_data['isRendered']
            resource_layer.display = json_data['isDisplayed']
            resource_layer.river = json_data['isRiver']
            resource_layer.save()
        except :
            resource_layer = ResourceLayer(resource=json_data['key'], 
            render=json_data['isRendered'], 
            display=json_data['isDisplayed'],
            river=json_data['isRiver'])
            resource_layer.save()
            pass
        
        return HttpResponse(status=200)
        