from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    request = kwargs.get("request")
    user = kwargs.get("user")
    page['header'].addMainMenuItem('resource/general/add_resource', 'onClick="fu.msg.newResource.dispatch()"')
    page['left_sidebar'].addBlock('resource/resource_list', '/resource', 'resource-list-block')
    page['head'].addJs('fursten-resource-list', 'local/resource/js/models.js')
    page['head'].addJs('fursten-resource', 'local/resource/js/views.js')
    page['head'].addJs('fursten-resource', 'local/resource/js/main.js')