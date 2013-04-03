# -*- coding:utf-8 -*-

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect
from django.template import Template
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout

from django.conf import settings
from fursten.diagram.models import SimulatorData
from fursten.utils.requests import RequestWithMethod
from fursten.resources.models import ResourceLayer, ResourceStyle

import json
import logging
import re
import urllib2


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
    try:
        SCALE = 200
        X=range(-50,50)
        Y=range(-50,50)
        simulator_host = SimulatorData.objects.get(pk=1).simulatorUrl
        url = settings.SIMULATOR_URL + "rest/nodes"
        req = RequestWithMethod(url, 'GET')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        f = urllib2.urlopen(req)
        data = json.loads(f.read())
        logger.info('DATA:\n' + str(data))
        logger.info(data['nodes'])
        for node in data['nodes']:
            logger.info(node['r'])
            resource_style = ResourceStyle.objects.get(resource=node['r'])
            logger.info(resource_style.icon)
            
        nodes_for_map = {}
        for node in data['nodes']:
            if node['r'] in nodes_for_map:
                nodes_for_map[node['r']].append([int(node['x']), int(node['y'])])
            else:
                nodes_for_map[node['r']] = [[int(node['x']), int(node['y'])]]
            

        logger.info(data)
        resources_with_nodes = [resource_name 
                                for resource_name 
                                in nodes_for_map.keys()]
        logger.info(resources_with_nodes)
        logger.info(nodes_for_map)
        paths, debug_dummy = contour.getPaths(SCALE, nodes_for_map, X, Y)

        data =  json.dumps({'nodes': nodes_for_map, 
                            'paths': paths,
                            })
        
#         if str(request.GET['tick']) == 'true':
#             requests.sendProcessRequest(simulator_host)
        
#         allNodes = requests.getNodes(simulator_host)
#         
#         resources_with_nodes = [resource_name 
#                                 for resource_name 
#                                 in RESOURCES_AREA_MAP 
#                                 if allNodes.has_key(resource_name)]
#         nodes = [allNodes[resource_name] 
#                  for resource_name 
#                  in resources_with_nodes]
#         paths, debug_dummy = contour.getPaths(SCALE, nodes, resources_with_nodes , X, Y)
#         
#         resources_with_nodes = [resource_name 
#                                 for resource_name 
#                                 in RESOURCES_NODE_MAP 
#                                 if allNodes.has_key(resource_name)]
#         nodes_for_map = {}
#         for resource in resources_with_nodes:
#             nodes_for_map[resource] = allNodes[resource]
#             
#         data =  json.dumps({'nodes': nodes_for_map, 
#                             'paths': paths,
#                             })
#         
        return HttpResponse(data)
    except Exception, e:
        logger.error(e)
        

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

