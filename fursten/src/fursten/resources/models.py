from django.db import models
from fursten.utils.graphics import OverwriteStorage

#class Resource(models.Model):
#    name = models.CharField(max_length=30)
#    pub_date = models.DateTimeField('date published')
    
class ResourceLayer(models.Model):
    resource = models.IntegerField(default=0)
    render = models.BooleanField(default=False)
    display = models.BooleanField(default=False)
    
class ResourceStyle(models.Model):
    resource = models.IntegerField(default=0)
    version = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to = 'resource/images', storage = OverwriteStorage(), null = True, blank = True)
    icon = models.ImageField(upload_to = 'resource/images', storage = OverwriteStorage(), null = True, blank = True)
    
    
    