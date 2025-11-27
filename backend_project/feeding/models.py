from django.db import models

class Feeding(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    activity_level = models.FloatField()

    #环境监测
    temperature = models.FloatField(null=True, blank=True)
    oxygen = models.FloatField(null=True, blank=True)
    ph = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp} - Activity: {self.activity_level}"
