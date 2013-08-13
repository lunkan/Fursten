from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
from fursten.resourcelist.models import ResourceLayer
from django.conf import settings
from PIL import Image, ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from fursten.simulatorproxy.resource_proxy import ResourceProxy
from fursten.simulatorproxy.proxy import Proxy
from fursten.utils.graphics import hex_to_rgb
from fursten.resourcestyles.models import ResourceStyle
from fursten.resourcestyles import helper
#from fursten.resourcestyles.models import ResourceStyle

def index(request):
    
    #return resource style list (not implemented)
    if request.method == 'GET':
        print "List resource styles is not implemented"
        return HttpResponse(status=400)
    
    #Create a new resource style (not implemented)
    if request.method == 'POST':
        print "By default all resources have style even if not saved in database - use put to save new resources "
        return HttpResponse(status=400)
    
@csrf_protect
def item(request, id):
    
    #Get a resource style instance by id
    #Styles always return an object - default if not yet created
    if request.method == 'GET':
        
        #Fetch resource to update or return default settings
        try:
            resource_style = ResourceStyle.objects.get(resource=id)
            style_data = {
                'id' : resource_style.resource,
                'color' : resource_style.color,
                'borderColor' : resource_style.border_color,
                'form' :  resource_style.form,
            }
            
        except ResourceStyle.DoesNotExist:
            style_data = {
                'id' : id,
                'color' : '#ffffff',
                'borderColor' : '#000000',
                'form' : 'circle'
            }
        
        return HttpResponse(simplejson.dumps(style_data), mimetype='application/json', status=200)
    
    #Update existing style
    #We make an exception to REST by allowing creation of new styles on PUT call
    #We simulate that all resources have a style attached even when not the case
    elif request.method == 'PUT':
        
        json_data = simplejson.loads(request.raw_post_data)
        print json_data
        
        #Create a resource if not yet exist
        try:
            resource_style = ResourceStyle.objects.get(resource=id)
        except ResourceStyle.DoesNotExist:
            resource_style = ResourceStyle(resource=id)
            
        resource_style = helper.apply_styles(resource_style, {
                                                              'form': json_data['form'].lower(),
                                                              'color': json_data['color'],
                                                              'border_color': json_data['borderColor']
                                                              })
        return HttpResponse(status=200)
    
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
    