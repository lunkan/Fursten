from django.db import models

#class Resource(models.Model):
#    name = models.CharField(max_length=30)
#    pub_date = models.DateTimeField('date published')
    
class ResourceLayer(models.Model):
    resource = models.IntegerField(default=0)
    render = models.BooleanField(default=False)
    display = models.BooleanField(default=False)
    