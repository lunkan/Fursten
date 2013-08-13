'''
Created on 5 aug 2013

@author: Jonas
'''
from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "in group!: "
    
    page['left_sidebar'].addBlock('resource/resource_list', 'blocks/block.html', { 'id':'resource-list-block', 'title':'Resource Index' })
    page['head'].addCss('fursten-resource', 'local/resource/css/resources.css')
    page['head'].addJs('fursten-resource-form', 'local/resource/js/resource-list.js')
    
    
