from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
    page['header'].addMainMenuItem('resource/general/add_resource', 'onClick', 'fu.msg.newResource.dispatch()')
    page['header'].addMainMenuItem('resource/general/extend_resource', 'onClick', 'fu.msg.extendResource.dispatch()')
    page['header'].addMainMenuItem('resource/general/edit_resource', 'onClick', 'fu.msg.editResource.dispatch()')
    page['header'].addMainMenuItem('resource/general/delete_resource', 'onClick', 'fu.msg.deleteResource.dispatch()')
    
    page['head'].addJs('fursten-resource-form', 'local/resource/js/resource-form.js')
    
    