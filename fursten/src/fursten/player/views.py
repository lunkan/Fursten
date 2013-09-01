# Create your views here.
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
import json
import logging

import models
from fursten.simulatorproxy.node_proxy import NodeProxy
from fursten.simulatorproxy.resource_proxy import ResourceProxy

import collectorTypes


logger = logging.getLogger('console')
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        default_data = { 'name': 'Gudrun' }
        return HttpResponse(json.dumps(default_data), mimetype='application/json')
    
    elif request.method == 'POST':
        data = json.loads(request.raw_post_data)
        logger.info(data)
        player = models.Player()
        player.name = data[u'name']
        player.user = request.user
        player.savedResources = json.dumps({})
        logger.info(player)
        player.active = False
        player.save()
        logger.info(request.user.player_set.all())
        return HttpResponse(status=200)
    
def getPlayers(request):
    if request.method == 'GET':
        playerList = []
        for player in request.user.player_set.all():
            playerList.append({'name': player.name, 'id': player.id})
        return HttpResponse(json.dumps(playerList), mimetype='application/json')

def selectPlayer(request):
    if request.method == 'POST':
        playerdata = {}
        playerId = request.POST['id']
        if playerId == 'None':
            playerset = request.user.player_set.filter(active = True)
            if len(playerset) == 0:
                playerdata['name'] = False
            elif len(playerset) > 1:
                playerdata['name'] = False
                logger.error('MORE THAN ONE PLAYER ACTIVE :%s'%playerset)
            else:
                player = playerset[0]
                logger.info(player)
                player.active = False
                player.save()
                logger.info(player)
                playerdata['name'] = False

        else:
            old_playerset = request.user.player_set.filter(active = True)
            for old_player in old_playerset:
                old_player.active = False
                old_player.save()
            player = request.user.player_set.get(id = playerId)
            player.active = True
            player.save()
            logger.info(player)
            collectors = player.collector_set.all()
            logger.info(collectors)
            playerdata['collectorcount'] = collectors.count()
            playerdata['savedResources'] = json.loads(player.savedResources)
            playerdata['name'] = player.name
        response = HttpResponse(json.dumps(playerdata), mimetype='application/json')
        return response
    
def getActivePlayer(request):
    if request.method == 'GET':
        playerdata = {}
        player = queryActivePlayer(request)
        if player == False:
            playerdata['name'] = False
        else:
            playerdata['name'] = player.name
            collectors = player.collector_set.all()
            logger.info(collectors)
            playerdata['collectorcount'] = collectors.count()
            playerdata['savedResources'] = json.loads(player.savedResources)
        response = HttpResponse(json.dumps(playerdata), mimetype='application/json')
        return response
    
def queryActivePlayer(request):
    retval = None
    playerset = request.user.player_set.filter(active = True)
    if len(playerset) == 0:
        retval = False
    else:
        retval = playerset[0]
    return retval

def putCollector(request):
    if request.method == 'POST':
        activePlayer = queryActivePlayer(request)
        if activePlayer != False:
            
            collectorname = request.POST['type']
            
            collector = models.Collector()
            collector.x = int(round(float(request.POST['x'])))
            collector.y = int(round(float(request.POST['y'])))
            collector.collects = collectorTypes.collectors[collectorname]['name']
            collector.player = activePlayer
            collector.name = collectorTypes.getName()
            collector.active = True
            logger.info(collector.name)
            collector.save()

            status, resources = ResourceProxy().getResources()
            for resource in resources['resources']:
                if resource['name'] == collectorname:
                    json_data = json.dumps({u'nodes': [{u'x': collector.x, u'y': collector.y, u'r': resource['key'], u'v': 1}]})
                    status, response = NodeProxy().addNodes(json_data)

        else:
            logger.info('Some kind of problem. No active player when putting collector.')
        response = HttpResponse("", mimetype='application/json')
        logger.info(response)
        return HttpResponse(response)
    
