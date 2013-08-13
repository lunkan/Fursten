from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
    page['header'].addMainMenuItem('resource/styles/edit_resource_style', 'onClick', 'fu.msg.editResourceStyle.dispatch()')
    page['head'].addJs('fursten-resource-form', 'local/resource/js/resource-style.js')