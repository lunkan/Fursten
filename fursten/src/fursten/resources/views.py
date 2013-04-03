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

#@never_cache

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
                    
                    try:
                        resource_style = ResourceStyle.objects.get(resource=resource['key'])
                        resource['icon'] = resource_style.icon.url + "?v=" + str(resource_style.version)
                    except :
                        resource['icon'] = settings.MEDIA_URL + "resource/default/icon_default.png"
    
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
        
        json_data = simplejson.loads(request.raw_post_data)
        
        opener = urllib2.build_opener(urllib2.HTTPHandler)
        req = urllib2.Request(url, data=simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        req.get_method = lambda: 'PUT'

        try:
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
        
    

    