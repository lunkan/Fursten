from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
#    page['header'].addMainMenuItem('resource/general/add_resource', 'onClick', 'fu.msg.newResource.dispatch()')
#    
#    page['left_sidebar'].addBlock('resource/resource_list', '/resource', 'resource-list-block')
    
    #Mitt
    
    page['left_sidebar'].addBlock('diagram/diagram_list', '/diagram', 'diagram-list-block')
    
    #Slut mitt
    
#    page['head'].addJs('fursten-resource-list', 'local/resource/js/models.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/views.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/main.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/mouse.js')
    
    #finns oxo addCss