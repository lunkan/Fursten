from django.db import models

class SimulatorData(models.Model):
    simulatorUrl = models.CharField(max_length=300)

# class DiagramData(models.Model):
#     data = models.TextField()