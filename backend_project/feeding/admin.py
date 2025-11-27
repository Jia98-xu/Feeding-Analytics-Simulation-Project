from django.contrib import admin
from .models import Feeding

@admin.register(Feeding)
class FeedingAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'activity_level')
    search_fields = ('timestamp',)
    ordering = ('-timestamp',)

# Register your models here.
