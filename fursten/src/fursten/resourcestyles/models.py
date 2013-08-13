from django.db import models
from fursten.utils.graphics import OverwriteStorage
    
class ResourceStyle(models.Model):
    resource = models.IntegerField(default=0)
    version = models.IntegerField(default=0)
    thumbnail = models.ImageField(upload_to = 'resource/images', storage = OverwriteStorage(), null = True, blank = True)
    icon = models.ImageField(upload_to = 'resource/images', storage = OverwriteStorage(), null = True, blank = True)
    form = models.CharField(max_length=64)
    color = models.CharField(max_length=7)
    border_color = models.CharField(max_length=7)
    
    