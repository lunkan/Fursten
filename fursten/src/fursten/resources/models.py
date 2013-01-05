from django.db import models

class Resource(models.Model):
    name = models.CharField(max_length=30)
    pub_date = models.DateTimeField('date published')