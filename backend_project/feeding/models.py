from django.db import models

class Feeding(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    #shrimp activity level from 0 to 1
    activity_level = models.FloatField(help_text="Shrimp activity level from 0 to 1")

    #Environment sensors
    temperature = models.FloatField(null=True, blank=True, help_text="Water temperature in Celsius")
    oxygen = models.FloatField(null=True, blank=True, help_text="Dissolved oxygen in mg/L")
    ph = models.FloatField(null=True, blank=True, help_text="pH level of the water")
    turbidity = models.FloatField(null=True, blank=True, help_text="Water turbidity in NTU")

    #Feeder output
    feed_rate = models.FloatField(null=True, blank=True, help_text="Feed rate (grams/minute)")
    feeder_status = models.CharField(max_length=20, choices=[
        ('Idle', 'Idle'),
        ('Feeding', 'Feeding'),
        ('Error', 'Error')
    ], default='Idle')

    #Feeding recommendation
    recommendation = models.CharField(max_length=20, choices=[
        ('Increase Feed', 'Increase Feed'),
        ('Maintain Feed', 'Maintain Feed'),
        ('Decrease Feed', 'Decrease Feed')
    ], null=True, blank=True)

    def apply_aq1_algorithm(self, base_feed_rate=10):
        a = self.activity_level
        temp = self.temperature
        do = self.oxygen
        ph = self.ph
        turb = self.turbidity

        #---AQ1 DO override---
        if do is not None and do < 3.5:
            self.feed_rate = 0
            self.feeder_status = 'Idle'
            self.recommendation = 'Decrease Feed'
            return
        #---AQ1 activity feeding---
        if a < 0.2:
            self.feed_rate = 0
            self.feeder_status = 'Idle'
            self.recommendation = 'Decrease Feed'
        elif 0.2 <= a < 0.4:
            self.feed_rate = base_feed_rate * 0.4
            self.feeder_status = 'Feeding'
            self.recommendation = 'Decrease Feed'
        elif 0.4 <= a < 0.7:
            self.feed_rate = base_feed_rate * 0.7
            self.feeder_status = 'Feeding'
            self.recommendation = 'Maintain Feed'
        else:
            self.feed_rate = base_feed_rate
            self.feeder_status = 'Feeding'
            self.recommendation = 'Increase Feed'

        #----AQ1 environment corrections---
        if do is not None and do < 5:
            self.feed_rate *= 0.8
        if temp is not None and (temp < 25 or temp > 32):
            self.feed_rate *= 0.9
        if ph is not None and (ph < 7.4 or ph > 8.8):
            self.feed_rate *= 0.8

        return {
            "activity": a,
            "feed_rate": self.feed_rate,
            "feeder_status": self.feeder_status,
            "recommendation": self.recommendation
        }

    def __str__(self):
        return f"{self.timestamp} - Activity: {self.activity_level}, Feed, {self.feed_rate}, Recommendation: {self.recommendation}"
