# -*- coding:utf-8 -*-

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect
from django.template import Template
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from fursten.diagram.models import SimulatorData

import json
import logging
import re


import requests
import contour

RESOURCES_AREA_MAP = ['recap_agric_field',
                      'vegetation_trees_leaf',
                      'vegetation_grass',
                      'vegetation_trees_evergreen',    
                      'hydro_surfacewater',
                      'recap_trans_road']

RESOURCES_NODE_MAP = ['recap_resa_manor',
                      'natres_silver_deposit',
                      'natres_iron_deposit',
                      'recap_res_village',
                      'recap_ind_mine',
                      'recap_ind_sawmill',
                      'act_taxes_lumber',
                      'act_taxes_food']

logger = logging.getLogger('console')



    
def getSvgJson(request):
    logger.info(request.GET)
    SCALE = 200
    X=range(-50,50)
    Y=range(-50,50)
    simulator_host = SimulatorData.objects.get(pk=1).simulatorUrl
    logger.info(request.GET['tick'])
    if str(request.GET['tick']) == 'true':
        logger.info('GOT TICK')
        requests.sendProcessRequest(simulator_host)
    
    allNodes = requests.getNodes(simulator_host)
    
    resources_with_nodes = [resource_name 
                            for resource_name 
                            in RESOURCES_AREA_MAP 
                            if allNodes.has_key(resource_name)]
    nodes = [allNodes[resource_name] 
             for resource_name 
             in resources_with_nodes]
    paths, debug_dummy = contour.getPaths(SCALE, nodes, resources_with_nodes , X, Y)
    
    resources_with_nodes = [resource_name 
                            for resource_name 
                            in RESOURCES_NODE_MAP 
                            if allNodes.has_key(resource_name)]
    nodes_for_map = {}
    for resource in resources_with_nodes:
        nodes_for_map[resource] = allNodes[resource]
        
    data =  json.dumps({'nodes': nodes_for_map, 
                        'paths': paths,
                        })
    
    
    return HttpResponse(data)

def getCss(request):
    simulator_host = SimulatorData.objects.get(pk=1).simulatorUrl
    cssdata = requests.sendFurstenCssRequest(simulator_host)
    for line in cssdata.splitlines():
        m = re.match(r"#(.*)\{.*color:(#.{6}).*", line)
        if (m is not None):
            cssdata += "\n#line_%s{stroke: %s;}"%(m.group(1), m.group(2))
        m = re.match(r"\.(.*?)-.*border-color:(#.{6}).*color:(#.{6}).*", line)    
        if (m is not None):
            cssdata += "\n.node_%s{stroke: %s; fill: %s;}"%(m.group(1), m.group(2), m.group(3))

    data = json.dumps({"css": cssdata})
    return HttpResponse(data)

@csrf_protect
def connectToSimulator(request):
    if request.method == 'GET':
        all_entries = SimulatorData.objects.all()
        if all_entries.count() == 0:
            simulatorData = SimulatorData(simulatorUrl = 'localhost:8888')
            simulatorData.save()
        else:
            simulatorData = SimulatorData.objects.get(pk=1)
        response = {
            'simulatorUrl': simulatorData.simulatorUrl,
        }
        
        return HttpResponse(json.dumps(response), mimetype='application/json')
    elif request.method == 'POST':
        json_data = json.loads(request.raw_post_data)
        simulatorData = SimulatorData.objects.get(pk=1)
        simulatorData.simulatorUrl = json_data['simulatorUrl']
        simulatorData.save()
        return HttpResponse(status=200)
    elif request.method == 'PUT':
        logger.info('PUT')
    return HttpResponse('SOME TEXT')