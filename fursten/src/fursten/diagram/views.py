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
from fursten.simulator.world_proxy import WorldProxy

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
        status, response = WorldProxy().getWorld()
        logger.info( "status: %i"%status)
        if status != 200:
            logger.info("No answer from world")
        else:
            world_width = response['width']
            world_height = response['height']
            logger.info("world width %i"%world_width)
            logger.info("world height %i"%world_height)
        
        SCALE = 200
        X=range(-50,50)
        Y=range(-50,50)
        url = settings.SIMULATOR_URL + "rest/nodes"
        req = RequestWithMethod(url, 'GET')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        f = urllib2.urlopen(req)
        data = json.loads(f.read())
        logger.info('DATA:\n' + str(data))
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
        
        colors_for_map = {}
        for key in nodes_for_map.keys():
            resource_style = ResourceStyle.objects.get(resource=key)
            colors_for_map[key] = {'color': resource_style.color, 'background_color': resource_style.background_color}
        logger.info(colors_for_map)
        paths, debug_dummy = contour.getPaths(SCALE, nodes_for_map, colors_for_map, X, Y)

        data =  json.dumps({'nodes': nodes_for_map, 
                            'paths': paths,
                            'world_width': world_width,
                            'world_height': world_height,
                            'colors': colors_for_map,
                            })
        logger.info(data)
       
        return HttpResponse(data)
    except Exception, e:
        logger.error(e)
        
