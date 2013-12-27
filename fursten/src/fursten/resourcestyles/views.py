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

import xml.etree.cElementTree as ET
import os
import glob
import fnmatch
import ntpath

from xml.dom import minidom

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
                'shape': resource_style.shape,
                'symbol' : resource_style.symbol,
                'background' : resource_style.background,
                'firstColor' : resource_style.first_color,
                'secondColor' : resource_style.second_color,
                'thirdColor' : resource_style.third_color,
                'fourthColor' : resource_style.fourth_color
    
            }
            
        except ResourceStyle.DoesNotExist:
            style_data = {
                'id' : id,
                'color' : '#ffffff',
                'borderColor' : '#000000',
                'form' : 'circle',
                'shape': 'default',
                'symbol' : 'none',
                'background' : 'none',
                'firstColor' : '#000000',
                'secondColor' : '#ffffff',
                'thirdColor' : '#ffffff',
                'fourthColor' : '#ffffff'
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
          'border_color': json_data['borderColor'],
          'shape': json_data['shape'],
          'symbol' : json_data['symbol'],
          'background' : json_data['background'],
          'first_color' : json_data['firstColor'],
          'second_color' : json_data['secondColor'],
          'third_color' : json_data['thirdColor'],
          'fourth_color' : json_data['fourthColor']
        })
        return HttpResponse(status=200)

def symbol(request, id, size):
    
    try:
        resource_style = ResourceStyle.objects.get(resource=id)
        style_data = {
            'shape': resource_style.shape,
            'symbol' : resource_style.symbol,
            'background' : resource_style.background,
            'first_color' : resource_style.first_color,
            'second_color' : resource_style.second_color,
            'third_color' : resource_style.third_color,
            'fourth_color' : resource_style.fourth_color
    
        }
        
    except ResourceStyle.DoesNotExist:
        style_data = {
            'shape': 'default',
            'symbol' : 'none',
            'background' : 'none',
            'first_color' : '#000000',
            'second_color' : '#ffffff',
            'third_color' : '#ffffff',
            'fourth_color' : '#ffffff'
        }
            
            
    svg = ET.Element("svg")
    svg.set('version', '1.1')
    svg.set('xmlns', 'http://www.w3.org/2000/svg')
    svg.set('x', '0px')
    svg.set('y', '0px')
    svg.set('width', size+'px')
    svg.set('height', size+'px')
    svg.set('viewBox', '0 0 64 64')
    
    defs = ET.SubElement(svg, "defs")
    mask = ET.SubElement(defs, "mask")
    mask.set('id', 'maskShape')
    mask.set('x', '0')
    mask.set('y', '0')
    mask.set('width', '64')
    mask.set('height', '64')
    
    '''shape_files = glob.glob(os.path.join(settings.MEDIA_ROOT, 'resource/shapes/*'))
    for shape_file in shape_files:
        if fnmatch.fnmatch(shape_file, '*.svg'):
            print ntpath.basename(shape_file)'''
    
    
    #os.path.join(settings.MEDIA_ROOT, 'resource/shapes/heart.svg')
    if style_data['shape'] == 'default':
        shape_path = 'resource/shapes/circle.svg'
    else:
        shape_path = 'resource/shapes/'+ style_data['shape'] +'.svg'
        
    shape_path_data = extractPath(os.path.join(settings.MEDIA_ROOT, shape_path));
    
    shape_path = ET.SubElement(mask, "path")
    shape_path.set('d', shape_path_data)
    shape_path.set('fill', '#ffffff');
        
    background = ET.SubElement(svg, "rect")
    background.set('x', '0')
    background.set('y', '0')
    background.set('width', '64')
    background.set('height', '64')
    background.set('fill', style_data['first_color'])
    background.set('mask', 'url(#maskShape)')
    
    if style_data['background'] != 'none':
        background_path = 'resource/backgrounds/'+ style_data['background'] +'.svg'
        background_path_data = extractPath(os.path.join(settings.MEDIA_ROOT, background_path));
        
        background_path = ET.SubElement(svg, "path")
        background_path.set('d', background_path_data)
        background_path.set('fill', style_data['second_color'])
        background_path.set('mask', 'url(#maskShape)')
    
    if style_data['symbol'] != 'none':
        symbol_path = 'resource/symbols/'+ style_data['symbol'] +'.svg'
        symbol_path_data = extractPath(os.path.join(settings.MEDIA_ROOT, symbol_path));
    
        symbol_path = ET.SubElement(svg, "path")
        symbol_path.set('d', symbol_path_data)
        symbol_path.set('fill', style_data['third_color'])
        symbol_path.set('mask', 'url(#maskShape)')
    
    #border = ET.SubElement(svg, "path")
    #border.set('d', shape_path_data)
    #border.set('stroke', '#ff0000')
    #border.set('fill', 'none')
    
    svg_string = ET.tostring(svg, encoding="utf-8")
    return HttpResponse(svg_string, mimetype='image/svg+xml')
    #text/xml')
    
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
    
def extractPath(svg_path):
    
    svg_doc = minidom.parse(svg_path)
    path_strings = [path.getAttribute('d') for path in svg_doc.getElementsByTagName('path')]
    svg_doc.unlink()
    path_data = path_strings[0]
    return path_data;
    