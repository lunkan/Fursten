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
import os
from fursten.simulatorproxy.world_proxy import WorldProxy
from fursten.simulatorproxy.node_proxy import NodeProxy
from fursten.simulatorproxy.process_proxy import ProcessProxy
from fursten.resourcestyles.models import ResourceStyle

@csrf_protect
def index(request):
    
    #Export project
    if request.method == 'GET':
        print "not implemented"
        return HttpResponse(status=400)
    
    #Import project
    elif request.method == 'POST':
        print "not implemented"
        return HttpResponse(status=400)

@csrf_protect
def newproject(request):
    
    if request.method == 'POST':
        json_data = simplejson.loads(request.raw_post_data)
        status, response = WorldProxy().newWorld(json_data)
        
        ResourceStyle.objects.all().delete()
        ResourceLayer.objects.all().delete()
        
        return HttpResponse(status=status)

@csrf_protect
def saveproject(request):
    
    if request.method == 'POST':
        status, response = ProcessProxy().save()
        return HttpResponse(status=status)
    
@csrf_protect
def loadproject(request):
    
    if request.method == 'POST':
        status, response = ProcessProxy().load()
        return HttpResponse(status=status)
   
@csrf_protect
def exportresource(request):
    
    #Export resources
    #params exportformat(xml|proto), filename
    if request.method == 'GET':
        
        try:
            
            if str(request.GET["exportformat"]) == 'xml':
                status, response = ResourceProxy(Proxy.MimeType.XML).getResources(details=True)
                response = HttpResponse(response, content_type='application/xml; charset=utf-8', mimetype=Proxy.MimeType.XML, )
                response['Content-Disposition'] = 'attachment; filename="' + str(request.GET["filename"]) + '.xml'
                return response
            
            elif  str(request.GET["exportformat"]) == 'protobuf':
                status, response = ResourceProxy(Proxy.MimeType.PROTOBUF).getResources(details=True)
                file = response.SerializeToString()
                response = HttpResponse(file, content_type='application/protobuf', mimetype=Proxy.MimeType.PROTOBUF, )
                response['Content-Disposition'] = 'attachment; filename="' + str(request.GET["filename"]) + '.proto'
                return response
        
            else:
                print 'Unable to export resources - unknown format'
                return HttpResponse(status=400)
        
        except Exception as inst:
            print 'failed to load resources'
            print type(inst)     # the exception instance
            print inst.args      # arguments stored in .args
            print inst           # __str__ allows args to printed directly
            return HttpResponse(status=500)

@csrf_protect
def importresource(request):
    
    #import resources
    if request.method == 'POST':
        
        fileName, fileExtension = os.path.splitext(request.FILES['resourcefile'].name)
        data = request.FILES['resourcefile'].read()
        
        if str(fileExtension) == '.xml':
            status, response = ResourceProxy(Proxy.MimeType.XML).replaceResources(data)
            return HttpResponse(status=200)
        elif str(fileExtension) == '.proto':
            status, response = ResourceProxy(Proxy.MimeType.PROTOBUF).replaceResources(data)
            return HttpResponse(status=200)
        else:
            print 'Unable to import resources - unknown format'
            return HttpResponse(status=400)
        
@csrf_protect
def exportnode(request):
    
    #Export nodes
    #params exportformat(xml|proto), filename
    if request.method == 'GET':
        print "export nodes"
        
        try:
            
            if str(request.GET["exportformat"]) == 'xml':
                status, response = NodeProxy(Proxy.MimeType.XML).getNodes()
                response = HttpResponse(response, content_type='application/xml; charset=utf-8', mimetype=Proxy.MimeType.XML, )
                response['Content-Disposition'] = 'attachment; filename="' + str(request.GET["filename"]) + '.xml'
                return response
            
            elif  str(request.GET["exportformat"]) == 'protobuf':
                status, response = NodeProxy(Proxy.MimeType.PROTOBUF).getNodes()
                file = response.SerializeToString()
                response = HttpResponse(file, content_type='application/protobuf', mimetype=Proxy.MimeType.PROTOBUF, )
                response['Content-Disposition'] = 'attachment; filename="' + str(request.GET["filename"]) + '.proto'
                return response
        
            else:
                print 'Unable to export resources - unknown format'
                return HttpResponse(status=400)
        
        except Exception as inst:
            print 'failed to load resources'
            print type(inst)     # the exception instance
            print inst.args      # arguments stored in .args
            print inst           # __str__ allows args to printed directly
            return HttpResponse(status=500)

@csrf_protect
def importnode(request):
    
    #import resources
    if request.method == 'POST':
        print "import node"
        fileName, fileExtension = os.path.splitext(request.FILES['nodefile'].name)
        data = request.FILES['nodefile'].read()
        
        if str(fileExtension) == '.xml':
            status, response = NodeProxy(Proxy.MimeType.XML).replaceNodes(data=data)
            return HttpResponse(status=200)
        elif str(fileExtension) == '.proto':
            status, response = NodeProxy(Proxy.MimeType.PROTOBUF).replaceNodes(data=data)
            return HttpResponse(status=200)
        else:
            print 'Unable to import nodes - unknown format'
            return HttpResponse(status=400)
    