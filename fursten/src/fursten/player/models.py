from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from django.db.models.signals import post_save

class UserProfile(models.Model):  
    user = models.OneToOneField(User)  
    #other fields here
    def __str__(self):  
        return "%s's profile" % self.user  

def create_user_profile(sender, instance, created, **kwargs):  
    if created:  
        profile, created = UserProfile.objects.get_or_create(user=instance)  

post_save.connect(create_user_profile, sender=User) 

class Player(models.Model):
    user = models.ForeignKey(User)
    name = models.TextField()
    active = models.BooleanField()
    savedResources = models.TextField()
    def __str__(self):  
        return "player %s, owned by %s, active? %s" %(self.name, self.user, self.active)
    

class Collector(models.Model):
    player = models.ForeignKey(Player)
    x = models.IntegerField()
    y = models.IntegerField()
    collects = models.TextField()
    name = models.TextField()
    active = models.BooleanField()