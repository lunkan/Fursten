from django.http import HttpResponseRedirect, HttpResponse
from django.core.context_processors import csrf
from django.template import Context, loader, RequestContext
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.shortcuts import redirect, render, render_to_response
from fursten.forms import LoginForm 

def index(request):
    login_form = LoginForm();
    return render_to_response('index/base.html', {'login_form':login_form}, context_instance=RequestContext(request))

def login(request):
    user = authenticate(username=request.POST['username'], password=request.POST['password'])
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            return redirect('/dashboard/')
        else:
            return redirect('/index?error=%s' % 'disabled')
    else:
        return redirect('/index?error=%s' % 'invalid')
    
def logout(request):
    auth_logout(request)
    return redirect('/')