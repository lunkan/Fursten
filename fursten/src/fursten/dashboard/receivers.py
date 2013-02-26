from django.contrib.auth.models import User
from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    
    page['head'].addCss('jquery', 'contrib/jquery/css/ui-lightness/jquery-ui-1.10.0.custom.css')
    
    page['head'].addCss('bootstrap-responsive','contrib/bootstrap/css/bootstrap-responsive.css')
    page['head'].addCss('bootstrap', 'contrib/bootstrap/css/bootstrap.min.css')
    page['head'].addCss('bootstrap-fursten', 'local/bootstrap/css/bootstrap-fursten.css')
    page['head'].addCss('fursten-main', 'local/dashboard/css/main.css')
    
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery-1.8.3.min.js')
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery-ui-1.10.0.custom.autocomplete.js')
    #page['head'].addJs('jquery', 'contrib/ajaxchosen/js/ajax-chosen.js')
    
    page['head'].addJs('backbone', 'contrib/backbone/js/underscore-1.4.3.js')
    page['head'].addJs('backbone', 'contrib/bootstrap/js/bootstrap.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-min-0.9.9.js')
    #page['head'].addJs('backbone', 'contrib/bootstrap/js/backbone.bootstrap-modal.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-forms.js')
    #page['head'].addJs('backbone', 'contrib/backbone/js/list.js')
    page['head'].addJs('backbone', 'local/backbone/js/autocomplete.js')
    page['head'].addJs('backbone', 'local/backbone/js/autocomplete-resource.js')
    page['head'].addJs('backbone', 'local/backbone/js/repeater.js')
    page['head'].addJs('backbone', 'local/backbone/js/static-fields.js')
    #page['head'].addJs('backbone', 'contrib/backbone/js/backbone-forms-extensions.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-custom-sync.js')
    
    page['head'].addJs('d3js', 'contrib/d3js/js/d3.v3.js')
    
    page['head'].addJs('fursten-signals', 'contrib/signals/js/signals.min.js')
    page['head'].addJs('fursten-core', 'local/backbone/js/jquery-selectableTable.js')
    page['head'].addJs('fursten-core', 'local/dashboard/js/main.js')
    
    page['header'].addUserMenuItem(user.username +'/general/logout', 'href', '/logout')
    page['header'].addUserMenuItem(user.username +'/general/settings', 'href', '/change_profile')
