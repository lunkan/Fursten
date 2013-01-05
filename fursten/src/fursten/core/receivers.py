from django.dispatch import receiver
from fursten.core.signals import *
from fursten.core.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    
    page['head'].addCss('bootstrap-responsive','contrib/bootstrap/css/bootstrap-responsive.css')
    page['head'].addCss('bootstrap', 'contrib/bootstrap/css/bootstrap.min.css')
    page['head'].addCss('fursten-main', 'local/core/css/main.css')
    
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery-1.8.3.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/underscore-1.4.3.js')
    page['head'].addJs('backbone', 'contrib/bootstrap/js/bootstrap.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-min-0.9.9.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-forms.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/list.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-custom-sync.js')
    
    page['head'].addJs('fursten-signals', 'contrib/signals/js/signals.min.js')
    page['head'].addJs('fursten-core', 'local/core/js/core.js')
    
    page['header'].addUserMenuItem('user/general/login', 'login')
    page['header'].addUserMenuItem('user/general/settings', 'change_profile')
