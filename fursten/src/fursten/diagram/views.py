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
from fursten.resourcelist.models import ResourceLayer
from fursten.resourcestyles.models import ResourceStyle
from fursten.simulatorproxy.world_proxy import WorldProxy
from fursten.simulatorproxy.resource_proxy import ResourceProxy

from fursten.player.models import Collector, Player

import json
import logging
import re
import urllib2


import requests
import contour
from fursten.simulatorproxy.node_proxy import NodeProxy
from fursten.simulatorproxy.proxy import Proxy
import math


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
        logger.info(request.user.get_profile())
        resources = ResourceProxy().getResources()
        resource_names = {}
        logger.info(resources)
        if resources[1]['resources'] is None:
            status, response = WorldProxy().getWorld()
            logger.info( "status: %i"%status)
            if status != 200:
                logger.info("No answer from world")
            else:
                world_width = response['width']
                world_height = response['height']
                logger.info("world width %i"%world_width)
                logger.info("world height %i"%world_height)
            data =  json.dumps({'nodes': {},
                    'river': {}, 
                    'paths': [],
                    'world_width': world_width,
                    'world_height': world_height,
                    'collectors': [],
                    'colors_for_area': {},
                    'colors_for_nodes': {},
                    'colors_for_river': {},
                    'resource_names': resource_names,
                    })
            logger.info(data)
       
            return HttpResponse(data)
        for resource_id, resource in zip(resources[1]['keySet'], resources[1]['resources']):
            resource_names[resource_id] = resource['name']
        logger.info(resource_names)
        status, response = WorldProxy().getWorld()
        logger.info( "status: %i"%status)
        if status != 200:
            logger.info("No answer from world")
        else:
            world_width = response['width']
            world_height = response['height']
            logger.info("world width %i"%world_width)
            logger.info("world height %i"%world_height)
        
        SCALE = 100
        X=range(-100,100)
        Y=range(-100,100)
        url = settings.SIMULATOR_URL + "rest/nodes"
        req = RequestWithMethod(url, 'GET')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        f = urllib2.urlopen(req)
        data = json.loads(f.read())
        logger.info('DATA:\n' + str(data))
        
        resources_for_area = []
        resources_for_nodes = []
        resources_for_river = []
        for resource_layer in ResourceLayer.objects.all():
            
            if resource_layer.render == True:
                resources_for_area.append(resource_layer.resource)
                logger.info("render:%s"%resource_layer.resource)
            if resource_layer.display == True:
                resources_for_nodes.append(resource_layer.resource)
                logger.info("display:%s"%resource_layer.resource)
            if resource_layer.river == True:
                resources_for_river.append(resource_layer.resource)
                logger.info("river:%s"%resource_layer.resource)
        
        nodes_for_area = {}
        for node in data['nodes']:
            if node['r'] in resources_for_area:
                if node['r'] in nodes_for_area:
                    nodes_for_area[node['r']].append([int(node['x']), int(node['y'])])
                else:
                    nodes_for_area[node['r']] = [[int(node['x']), int(node['y'])]]
            
        
        

        logger.info(data)
        logger.info(nodes_for_area)
        
        colors_for_area = {}
        for key in nodes_for_area.keys():
            if  ResourceStyle.objects.filter(resource=key).exists():
                resource_style = ResourceStyle.objects.get(resource=key)
                colors_for_area[key] = {'color': resource_style.color, 'border_color': resource_style.border_color}
            else:
                colors_for_area[key] = {'color': '0xffffff', 'border_color': '0x000000'}
        logger.info(colors_for_area)
        
        paths, debug_dummy = contour.getPaths(SCALE, nodes_for_area, colors_for_area, X, Y)
        nodes_for_map = {}
        
        for node in data['nodes']:
            if node['r'] in resources_for_nodes:
                if node['r'] in nodes_for_map:
                    nodes_for_map[node['r']].append([int(node['x']), int(node['y'])])
                else:
                    nodes_for_map[node['r']] = [[int(node['x']), int(node['y'])]]
        colors_for_nodes = {}
        for key in resources_for_nodes:
            if  ResourceStyle.objects.filter(resource=key).exists():
                resource_style = ResourceStyle.objects.get(resource=key)
                colors_for_nodes[key] = {'color': resource_style.color, 'border_color': resource_style.border_color}
            else:
                colors_for_nodes[key] = {'color': '0xffffff', 'border_color': '0x000000'}
        logger.info(colors_for_nodes)
        nodes_for_river = {}
        for node in data['nodes']:
            if node['r'] in resources_for_river:
                if node['r'] in nodes_for_river:
                    nodes_for_river[node['r']].append([int(node['x']), int(node['y'])])
                else:
                    nodes_for_river[node['r']] = [[int(node['x']), int(node['y'])]]        
        colors_for_river = {}
        logger.info(resources_for_river)
        for key in resources_for_river:
            if  ResourceStyle.objects.filter(resource=key).exists():
                resource_style = ResourceStyle.objects.get(resource=key)
                colors_for_river[key] = {'color': resource_style.color, 'border_color': resource_style.border_color}
            else:
                colors_for_river[key] = {'color': '0xffffff', 'border_color': '0x000000'}
        logger.info(colors_for_river)
        
        collectorset = Collector.objects.all()
        
        collectors_for_map =[]
        
        for collector in collectorset:
            collectors_for_map.append({'x': collector.x, 'y': collector.y, 'playername': collector.player.name})
        
        data =  json.dumps({'nodes': nodes_for_map,
                            'river': nodes_for_river, 
                            'paths': paths,
                            'collectors': collectors_for_map,
                            'world_width': world_width,
                            'world_height': world_height,
                            'colors_for_area': colors_for_area,
                            'colors_for_nodes': colors_for_nodes,
                            'colors_for_river': colors_for_river,
                            'resource_names': resource_names,
                            })
        logger.info(data)
       
        return HttpResponse(data)
    except Exception, e:
        logger.error(e)
        
        
def runGameTurn(request):
    if request.method == 'POST':
        resources = ResourceProxy().getResources()
        resource_ids = {}
        for resource_id, resource in zip(resources[1]['keySet'], resources[1]['resources']):
            resource_ids[resource['name']] = resource_id
        status, response = NodeProxy().getNodes()
        if status != 200:
            logger.info("No answer from getNodes")
        else:
            logger.info(status)
            logger.info(response)
            # Naive implementation
            # Feel free to optimize
            playerset = Player.objects.all()
            
            logger.info(playerset)
            for player in playerset:
                logger.info(player)
                savedResources = json.loads(player.savedResources)
                collectorset = player.collector_set.all()
                for collector in collectorset:
                    for node in response['nodes']:
                        if node['r'] == resource_ids[collector.collects]:
                            if math.sqrt((node['x'] - collector.x)**2 + (node['y'] -  collector.y)**2) < 1000:
                                logger.info('%s has %s at %i, %i', player.name, collector.collects, node['x'], node['y'])
                                if savedResources.has_key(collector.collects):
                                    savedResources[collector.collects] += 1
                                else:
                                    savedResources[collector.collects] = 1
                player.savedResources = json.dumps(savedResources)
                player.save()
        return HttpResponse("")
    
    
    