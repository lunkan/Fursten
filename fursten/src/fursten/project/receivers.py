from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    page['header'].addMainMenuItem('project/resource/import_resources', 'onClick', 'fu.msg.importResources.dispatch()')
    page['header'].addMainMenuItem('project/resource/export_resources', 'onClick', 'fu.msg.exportResources.dispatch()')
    page['header'].addMainMenuItem('project/node/import_nodes', 'onClick', 'fu.msg.importNodes.dispatch()')
    page['header'].addMainMenuItem('project/node/export_nodes', 'onClick', 'fu.msg.exportNodes.dispatch()')
    page['header'].addMainMenuItem('project/general/new_project', 'onClick', 'fu.msg.newProject.dispatch()')
    page['header'].addMainMenuItem('project/general/save_project', 'onClick', 'fu.msg.save.dispatch()')
    page['header'].addMainMenuItem('project/general/load_project', 'onClick', 'fu.msg.load.dispatch()')
    
    page['head'].addJs('project-exportimport-resource', 'local/project/js/project-exportimport-resource.js')
    page['head'].addJs('project-exportimport-node', 'local/project/js/project-exportimport-node.js')
    page['head'].addJs('fursten-project-form', 'local/project/js/project-form.js')
    page['head'].addJs('fursten-project-form', 'local/project/js/project-save.js')
    
    