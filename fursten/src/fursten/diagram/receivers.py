from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
    page['header'].addMainMenuItem('diagram/general/connect', 'onClick', 'fu.msg.connectToSimulator.dispatch()')    
    page['left_sidebar'].addBlock('diagram/diagram_controls', '/diagram', 'diagram-controls-block')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/views.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/main.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/mouse.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/models.js')
