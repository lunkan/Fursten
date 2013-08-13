from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *
import urllib2

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    
    page['header'].addMainMenuItem('simulator/general/run', 'onClick', 'fu.msg.runSimulator.dispatch()')
    page['header'].addMainMenuItem('simulator/general/clean', 'onClick', 'fu.msg.cleanSimulator.dispatch()')
    page['header'].addMainMenuItem('simulator/nodes/clear', 'onClick', 'fu.msg.clearNodes.dispatch()')
    
    print "add master"
    page['head'].addJs('fursten-simulator', 'local/simulator/js/simulator-master.js')
    page['head'].addJs('fursten-simulator', 'local/simulator/js/simulator-run-dialog.js')
    
    #page['head'].addJs('fursten-resource', 'local/simulator/js/models.js')
    #page['head'].addJs('fursten-resource', 'local/simulator/js/main.js')
    
    #page['left_sidebar'].addBlock('simulator/process', 'blocks/process-control-panel.html', { 'id':'process-control-panel-block', 'title':'Process' })
    #page['left_sidebar'].addBlock('simulator/status', 'blocks/block.html', { 'id':'process-status-block', 'title':'Status' })