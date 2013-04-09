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
    page['header'].addMainMenuItem('resource/filters/update_resource_filters', 'onClick', 'fu.msg.updateResourceFilters.dispatch()')
    page['header'].addMainMenuItem('resource/styles/edit_resource_style', 'onClick', 'fu.msg.editResourceStyle.dispatch()')
    page['header'].addMainMenuItem('resource/export_import/import_resources', 'onClick', 'fu.msg.importResources.dispatch()')
    page['header'].addMainMenuItem('resource/export_import/export_resources', 'onClick', 'fu.msg.exportResources.dispatch()')
    
    page['left_sidebar'].addBlock('resource/resource_list', 'blocks/block.html', { 'id':'resource-list-block', 'title':'Resource Index' })
    page['head'].addJs('fursten-resource-list', 'local/resource/js/models.js')
    page['head'].addJs('fursten-resource', 'local/resource/js/main.js')