from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
    #page['left_sidebar'].addBlock('diagram/diagram_controls', '/diagram', 'diagram-controls-block')
#    page['header'].addMainMenuItem('diagram/general/connect', 'onClick', 'fu.msg.connectToSimulator.dispatch()')
    page['left_sidebar'].addBlock('diagram/diagram_control', 'blocks/diagram-control.html', { 'id':'diagram-control-block', 'title':'Diagram Control', 'custom_var_a':'My custom var A','custom_var_b':'Mycustom var B' })
    #page['left_sidebar'].addBlock('diagram/diagram_list', '/diagram', 'diagram-list-block')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/views.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/main.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/mouse.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/models.js')
    page['head'].addJs('fursten-diagram', 'local/diagram/js/diagram.js')
