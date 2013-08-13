from django.contrib.auth.models import User
from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    
    print "ver: 1"
    
    
    page['head'].addCss('jquery', 'contrib/jquery/css/ui-lightness/jquery-ui-1.10.0.custom.css')
    
    
    page['head'].addCss('bootstrap', 'contrib/bootstrap/css/bootstrap.min.css')
    page['head'].addCss('bootstrap', 'contrib/bootstrap/css/bootstrap-glyphicons.css')
    
    page['head'].addCss('bootstrap-fursten', 'local/bootstrap/css/bootstrap-fursten.css')
    page['head'].addCss('fursten-main', 'local/dashboard/css/main.css')
    page['head'].addCss('fursten-main', 'local/dashboard/css/fursten-forms.css')
    
    
    
    page['head'].addJs('moment', 'contrib/moment/js/moment.min.js')
    
    #Jquery
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery-1.8.3.min.js')
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery.cookie.js')
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery-ui-1.10.0.custom.autocomplete.js')
    page['head'].addJs('jquery', 'contrib/jquery/js/jquery.form.js')
    
    #Bootstrap
    page['head'].addJs('bootstrap', 'contrib/bootstrap/js/bootstrap.min.js')
    
    #colorpicker
    page['head'].addCss('colorpicker', 'contrib/bootstrap-colorpicker/css/colorpicker.css')
    page['head'].addJs('colorpicker', 'contrib/bootstrap-colorpicker/js/bootstrap-colorpicker.js')
    
    #Backbone
    page['head'].addJs('backbone', 'contrib/backbone/js/underscore-1.4.4.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-1.0.0.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-forms.min.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/editors/repeater.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/editors/autocomplete.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/editors/colorpicker.js')
    
    #Backbone skins
    page['head'].addJs('backbone', 'contrib/backbone/js/skins/bootstrap/bootstrap-skin.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/skins/bootstrap/editors/bootstrap-repeater.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/skins/bootstrap/editors/bootstrap-autocomplete.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/skins/bootstrap/editors/bootstrap-colorpicker.js')
    
    page['head'].addJs('backbone', 'local/backbone/js/bootstrap-autocomplete-resource.js')
    
    
    #page['head'].addJs('backbone', 'local/backbone/js/autocomplete.js')
    
    #page['head'].addJs('backbone', 'local/backbone/js/colorpicker.js')
    

    
    
    #page['head'].addJs('backbone', 'local/backbone/js/repeater.js')
    
    page['head'].addJs('backbone', 'local/backbone/js/static-fields.js')
    page['head'].addJs('backbone', 'contrib/backbone/js/backbone-custom-sync.js')
    
    page['head'].addJs('django', 'local/django/js/ajax-csrf.js');
    
    page['head'].addJs('d3js', 'contrib/d3js/js/d3.v3.js')
    
    page['head'].addJs('fursten-signals', 'contrib/signals/js/signals.min.js')
    #page['head'].addJs('fursten-core', 'local/backbone/js/jquery-selectableTable.js')
    page['head'].addJs('fursten-core', 'local/dashboard/js/main.js')
    
    page['header'].addUserMenuItem(user.username +'/general/logout', 'href', '/logout')
    page['header'].addUserMenuItem(user.username +'/general/settings', 'href', '/change_profile')
