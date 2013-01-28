from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import datetime
from fursten.resources.forms import ResourceForm
from fursten.resources.models import Resource
import urllib2
import urllib

def index(request):
    resource_list = Resource.objects.order_by('-pub_date')
    
    to_json = []
    for resource in resource_list:
        to_json.append({"name":resource.name});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')

def search(request):
    
    response = []
    term = request.GET.get('term', '').lower()
    resource_list = Resource.objects.order_by('-pub_date')
    for resource in resource_list:
        if resource.name.lower().find(term) != -1:
            response.append(resource.name)
    
    response.sort()
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    
@csrf_protect
def new(request):
    
    if request.method == 'GET':
        #to_json = {
        #    'name': 'New Resource'
        #}
        
        #to_json = {
        #    'name': 'New Resourcing',
        #    'threshold': 100,
        #    'offsprings': [],
        #    'weightgroup': [{'resource':15,'value':9,'group':2}]
        #}
        
        to_json = {
            'name': 'New Resourcing',
            'threshold': 100,
            'offsprings': [{'resource':14,'value':1}],
            'weightgroups': [{'weights':[{'resource':12,'value':35,'group':1},{'resource':11,'value':37,'group':2}]},{'weights':[{'resource':12,'value':35,'group':1}]}]
        }
        
        #'weights': [{'resource':15,'value':9,'group':2},{'resource':1,'value':2,'group':3}]
            
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    elif request.method == 'POST':
        url="http://127.0.0.1:8989/Fursten-simulator/rest/resources/"
        json_data = simplejson.loads(request.raw_post_data)
        req = urllib2.Request(url)
        req.add_data(simplejson.dumps(json_data))
        req.add_header('Content-Type', 'application/json')
        req.add_header('Accept', 'application/json')
        f = urllib2.urlopen(req)
        #to_json = simplejson.loads(f.read())
        print f.getcode();
        return HttpResponse(status=200)
    
        #return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    
        #json_data = simplejson.loads(request.raw_post_data)
        #print request.raw_post_data
        #return HttpResponse(status=200)
        #form = ResourceForm(json_data)
        
        #if not form.is_valid():
        #    return HttpResponseBadRequest(simplejson.dumps(form.errors), mimetype='application/json')
        #else:
        #    cd = form.cleaned_data
        #    res = Resource(name=cd['name'], pub_date=datetime.datetime.now())
        #    res.save();
        #    return HttpResponse(status=200)
        
    elif request.method == 'PUT':
        print "put"
    