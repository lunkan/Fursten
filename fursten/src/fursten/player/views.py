# Create your views here.
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
import json
import logging

logger = logging.getLogger('console')
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        default_data = { 'name': 'Gudrun' }
        return HttpResponse(json.dumps(default_data), mimetype='application/json')
    
    elif request.method == 'POST':
        data = json.loads(request.raw_post_data)
        logger.info(data)
        return HttpResponse(status=200)