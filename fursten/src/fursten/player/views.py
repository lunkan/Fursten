# Create your views here.
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
import json
import logging

import models

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
        logger.info(player)
        player.save()
        logger.info(request.user.player_set.all())
        return HttpResponse(status=200)
    
def getPlayers(request):
    if request.method == 'GET':
        playerList = []
        for player in request.user.player_set.all():
            playerList.append({'name': player.name, 'id': player.id})
        return HttpResponse(json.dumps(playerList), mimetype='application/json')
    