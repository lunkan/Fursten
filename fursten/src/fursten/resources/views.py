from django.http import HttpResponseRedirect, HttpResponse
from django.utils import simplejson

def index(request):
    to_json = [
        {"id":"res0", "value": "reource0", "label": "res0"},
        {"id":"res1", "value": "reource1", "label": "res1"},
        {"id":"res2", "value": "recouce2", "label": "res2"}
    ]
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')

def new(request):
    if request.method == 'GET':
        print "get"
        to_json = {
            'title': 'Mrs',
            'name': 'Muulle Moroo',
            'password': 'cool'
        }
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    elif request.method == 'POST':
        print "post"
    elif request.method == 'PUT':
        print "put"
    