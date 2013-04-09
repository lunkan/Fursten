from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import datetime
from fursten.resources.forms import ResourceForm
from fursten.resources.models import ResourceLayer, ResourceStyle
import urllib2
import urllib
import httplib
from fursten.utils.requests import RequestWithMethod
from django.conf import settings
import types
from PIL import Image, ImageDraw
from PIL.EpsImagePlugin import EpsImageFile
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.base import File
from fursten.utils.graphics import hex_to_rgb, rgb_to_hex 
from django.views.decorators.cache import never_cache
from fursten.diagram import test_pb2
from fursten.resources import simulator_protos_pb2
import os
from fursten.simulator.resource_proxy import ResourceProxy

#@never_cache

def index(request):
    
    if request.method == 'GET':
        print "GET index"
        
        status, response = ResourceProxy().getResources()
        if status != 200:
            return HttpResponse(status=status)
            
        resource_layers = []
        
        #Append data from interface (fursten)
        for resource in response['resources']:
            
            #Merge with icon
            try:
                resource_style = ResourceStyle.objects.get(resource=resource['key'])
                resource['icon'] = resource_style.icon.url + "?v=" + str(resource_style.version)
            except :
                resource['icon'] = settings.MEDIA_URL + "resource/default/icon_default.png"
            
            #merge with render-filter
            try :
                resource_layer = ResourceLayer.objects.get(resource=resource['key'])
                resource['isDisplayed'] = resource_layer.display
                resource['isRendered'] = resource_layer.render
                resource_layers.append(resource_layer);
            except :
                resource['isDisplayed'] = False
                resource['isRendered'] = False
                pass
        
        #Update resource layers  
        #todo: improve!
        ResourceLayer.objects.all().delete()
        for updatedResourceLayer in resource_layers:
            resource_layer = ResourceLayer(resource=updatedResourceLayer.resource, render=updatedResourceLayer.render, display=updatedResourceLayer.display)
            resource_layer.save()
        
        return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    
    #post current filter settings (render, delete)
    elif request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        for resource in json_data['resources']:
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
        resource_key = request.GET['filter'];
        
        #delete all if no key is provided
        if resource_key is not None:
            status, response = ResourceProxy().deleteResource(resource_key)
        else:
            status, response = ResourceProxy().deleteResources()
        
        return HttpResponse(status=status)
        
def search(request):
    
    term = request.GET.get('term', '').lower()
    search_result = []
    
    status, response = ResourceProxy().getResources()
    if status != 200:
        return HttpResponse(status=status)
    
    for resource in response['resources']:
        if resource['name'].lower().find(term) != -1:
            search_result.append(resource['name'])
            
    search_result.sort()
    return HttpResponse(simplejson.dumps(search_result), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        default_data = { 'name': 'New Resourcing' }
        return HttpResponse(simplejson.dumps(default_data), mimetype='application/json')
    
    elif request.method == 'POST':
        data = simplejson.loads(request.raw_post_data)
        status, response = ResourceProxy().addResource(data)
        return HttpResponse(status=status)
    
@csrf_protect
def item(request, id):
    
    if request.method == 'GET':
        
        status, response = ResourceProxy().getResource(id)
        if status != 200:
            return HttpResponse(status=status)
        else:
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    
    elif request.method == 'POST':
        
        json_data = simplejson.loads(request.raw_post_data)
        status, response = ResourceProxy().addResource(json_data, id)
        return HttpResponse(status=status)
        
    elif request.method == 'PUT':
        
        json_data = simplejson.loads(request.raw_post_data)
        status, response = ResourceProxy().replaceResource(json_data, id)
        return HttpResponse(status=status)
    
@csrf_protect
def import_export(request):

    if request.method == 'GET':
        print "GET export"
        
        url = settings.SIMULATOR_URL + "rest/resources/"
        req = urllib2.Request(url)
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/x-protobuf')
    
        try:
            f = urllib2.urlopen(req)
            resourceResponse = simulator_protos_pb2.ResourceResponse()
            resourceResponse.ParseFromString(f.read())
            f.close()

            for resource in resourceResponse.resource:
                try:
                    print resource.name + " - " + str(resource.key) + " - " + str(resource.threshold)
                except Exception as e:
                    print e
                
        except Exception as e:
                print e
    
        file = resourceResponse.SerializeToString()
        return HttpResponse(file, mimetype='application/x-protobuf')
    
    if request.method == 'POST':
        print "POST import"
        
        #resource_proxy = ResourceProxy()
        #resource_proxy.getResources(details=True, resource_keys, method)
        status, response = ResourceProxy().getResources()
        #resource_proxy.getResources()
        print response
        for resource in response['resources']:
            try:
                print resource['name'] + " # " + str(resource['key'])
                # + " - " + resource.key + " - " + resource.threshold
            except Exception as e:
                print e
        return
    
        data1 = request.FILES['resource-file'].read()
        resourceResponse = simulator_protos_pb2.ResourceResponse()
        resourceResponse.ParseFromString(data1)
        
        for resource in resourceResponse.resource:
            try:
                print resource.name + " # " + str(resource.key)
                # + " - " + resource.key + " - " + resource.threshold
            except Exception as e:
                print e
        
        print "Read it"
        
        '''url = settings.SIMULATOR_URL + "rest/resources/"
        file = resourceResponse.SerializeToString()
    
        try:
            header = {"Content-Type": "application/x-protobuf"}
            conn = httplib.HTTPConnection('localhost', 8989)
            conn.request("PUT", "/Fursten-simulator/rest/resources/", file , header)
        except Exception as e:
            print e'''
        
        #print resourceResponse.resource
        #print resourceResponse.success
                
        return HttpResponse(status=200)

@csrf_protect
def style(request, id):
    
    if request.method == 'GET':
        
        style_data = {
            'color' : '#ffffff',
            'borderColor' : '#000000',
            'form' : 'Circle'
        }
        
        return HttpResponse(simplejson.dumps(style_data), mimetype='application/json', status=200)
    
    elif request.method == 'POST':
        print "POST style item:"+id
        return HttpResponse(status=200)
        
    elif request.method == 'PUT':
        try: # Added to simplify debugging
            thumb_size = (64,64)
            icon_size = (14, 14)
            thumb_image = Image.new('RGBA', thumb_size)
            draw = ImageDraw.Draw(thumb_image)
            
            json_data = simplejson.loads(request.raw_post_data)
            print json_data
            try:
                color = hex_to_rgb(json_data['color'])
                background_color = hex_to_rgb(json_data['borderColor'])
                form = json_data['form'].lower();
            except Exception:
                to_json = {'error': 'Exception.'}
                return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
            
            if form == "circle":
                draw.ellipse((2, 2, 62, 62), fill=background_color)
                draw.ellipse((10, 10, 54, 54), fill=color)
                
            elif form == "cube":
                draw.rectangle((2, 2, 62, 62), fill=background_color)
                draw.rectangle((10, 10, 54, 54), fill=color)
                
            elif form == "diamond":
                draw.polygon([(32, 2), (2, 32), (32, 62), (62, 32)], fill=background_color)
                draw.polygon([(32, 10), (10, 32), (32, 54), (54, 32)], fill=color)
                
            elif form == "triangle":
                draw.polygon([(32, 2), (2, 64), (64, 64)], fill=background_color)
                draw.polygon([(32, 22), (14, 53), (50, 53)], fill=color)
                
            else :
                to_json = {'error': 'Exception.'}
                return HttpResponse(simplejson.dumps(to_json), mimetype='application/json', status=400)
            
            del draw # I'm done drawing so I don't need this anymore
            
            icon_image = thumb_image.copy()
            icon_image.thumbnail(icon_size, Image.ANTIALIAS)
            
            icon_image_io = StringIO.StringIO()
            icon_image.save(icon_image_io, format='PNG')
            icon_image_file_name = "icon_" + id + ".png";
            icon_image_file = InMemoryUploadedFile(icon_image_io, None, icon_image_file_name, 'image/png', icon_image_io.len, None)
            
            thumb_image_io = StringIO.StringIO()
            thumb_image.save(thumb_image_io, format='PNG')
            thumb_image_file_name = "thumbnail_" + id + ".png";
            thumb_image_file = InMemoryUploadedFile(thumb_image_io, None, thumb_image_file_name, 'image/png', thumb_image_io.len, None)
            
            try:
                resource_style = ResourceStyle.objects.get(resource=id)
            except ResourceStyle.DoesNotExist:
                resource_style = ResourceStyle(resource=id)
            
            resource_style.version = resource_style.version +1;
            resource_style.thumbnail.save(thumb_image_file_name, thumb_image_file, save=True)
            resource_style.icon.save(icon_image_file_name, icon_image_file, save=True)
            resource_style.color = json_data['color']
            resource_style.background_color = json_data['borderColor']
            resource_style.save()
        except Exception, e:
            print e    
        return HttpResponse(simplejson.dumps(json_data), mimetype='application/json', status=200)
    
def thumbnail(request, id):
    
    try:
        resource_style = ResourceStyle.objects.get(resource=id)
        image_url = resource_style.thumbnail.url + "?v=" + str(resource_style.version)
        return HttpResponseRedirect(image_url)
    except :
        image_url = settings.MEDIA_URL + "resource/default/thumbnail_default.png"
        return HttpResponseRedirect(image_url)
    
def icon(request, id):
    
    try:
        resource_style = ResourceStyle.objects.get(resource=id)
        image_url = resource_style.icon.url + "?v=" + str(resource_style.version)
        return HttpResponseRedirect(image_url)
    except :
        image_url = settings.MEDIA_URL + "resource/default/icon_default.png"
        return HttpResponseRedirect(image_url)
        
    

    