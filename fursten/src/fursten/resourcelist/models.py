from django.db import models
from fursten.utils.graphics import OverwriteStorage
    
class ResourceLayer(models.Model):
    resource = models.IntegerField(default=0)
    render = models.BooleanField(default=False)
    display = models.BooleanField(default=False)
    river = models.BooleanField(default=False)
    
    