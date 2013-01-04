from django.http import HttpResponseRedirect, HttpResponse
from django.utils import simplejson

def index(request):
    to_json = [
        {"label": "reource1", "id": "res1"},
        {"label": "recouce2", "id": "res2"}
    ]
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')