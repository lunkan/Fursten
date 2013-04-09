from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "nodes in group!: "
    
    page['header'].addMainMenuItem('node/general/set_nodes', 'onClick', 'fu.msg.setNodes.dispatch()')
    page['header'].addMainMenuItem('node/general/add_nodes', 'onClick', 'fu.msg.newNodes.dispatch()')
    page['header'].addMainMenuItem('node/general/delete_nodes', 'onClick', 'fu.msg.deleteNodes.dispatch()')
    page['header'].addMainMenuItem('node/general/clear_nodes', 'onClick', 'fu.msg.clearNodes.dispatch()')
    page['header'].addMainMenuItem('node/samples/get_samples', 'onClick', 'fu.msg.getSamples.dispatch()')
    page['header'].addMainMenuItem('node/export_import/import_nodes', 'onClick', 'fu.msg.importNodes.dispatch()')
    page['header'].addMainMenuItem('node/export_import/export_nodes', 'onClick', 'fu.msg.exportNodes.dispatch()')
    
    page['head'].addJs('fursten-node', 'local/node/js/models.js')
    page['head'].addJs('fursten-node', 'local/node/js/main.js')