from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect
from django.utils import simplejson
import datetime
from fursten.resources.forms import ResourceForm
from fursten.resources.models import Resource 

def index(request):
    resource_list = Resource.objects.order_by('-pub_date')
    
    to_json = []
    for resource in resource_list:
        to_json.append({"name":resource.name});
    
    return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')

@csrf_protect
def new(request):
    
    if request.method == 'GET':
        to_json = {
            'name': 'New Resource'
        }
        return HttpResponse(simplejson.dumps(to_json), mimetype='application/json')
    
    elif request.method == 'POST':
        #No nice solution, but my json from backbone does not work directly with djsango forms
        json_data = simplejson.loads(request.raw_post_data)
        form = ResourceForm(json_data)
        
        if not form.is_valid():
            return HttpResponseBadRequest(simplejson.dumps(form.errors), mimetype='application/json')
        else:
            cd = form.cleaned_data
            res = Resource(name=cd['name'], pub_date=datetime.datetime.now())
            res.save();
            return HttpResponse(status=200)
        
    elif request.method == 'PUT':
        print "put"
    