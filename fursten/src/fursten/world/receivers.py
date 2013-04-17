from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *
import urllib2

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    page['header'].addMainMenuItem('file/general/new_world', 'onClick', 'fu.msg.newWorld.dispatch()')
    page['header'].addMainMenuItem('file/general/clean_simulator', 'onClick', 'fu.msg.cleanSimulator.dispatch()')
    page['head'].addJs('fursten-resource', 'local/world/js/models.js')
    page['head'].addJs('fursten-resource', 'local/world/js/main.js')
    
    page['left_sidebar'].addBlock('simulator/process', 'blocks/process-control-panel.html', { 'id':'process-control-panel-block', 'title':'Process' })
    page['left_sidebar'].addBlock('simulator/status', 'blocks/block.html', { 'id':'process-status-block', 'title':'Status' })