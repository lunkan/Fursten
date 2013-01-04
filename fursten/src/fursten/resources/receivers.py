from django.dispatch import receiver
from fursten.core.signals import *
from fursten.core.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    page['header'].addMainMenuItem('resource/general/add_resource', 'onClick="fursten.msg.newResource.dispatch()"')
    page['header'].addMainMenuItem('resource/general/extend_resource', 'extend_resource')
    page['header'].addMainMenuItem('resource/import-export/import_resources', 'import_resources')
    page['header'].addMainMenuItem('resource/import-export/export_resources', 'export_resources')
    
    page['left_sidebar'].addBlock('resource/resource_list', '/resource', 'resource-list-block')
    
    page['head'].addJs('fursten-resource-list', 'local/resource/js/models.js')
    page['head'].addJs('fursten-resource', 'local/resource/js/views.js')
    page['head'].addJs('fursten-resource', 'local/resource/js/main.js')