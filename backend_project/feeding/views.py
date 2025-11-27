#from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Max, Min
from .models import Feeding
from .serializers import FeedingSerializer

import feeding.simulator_state as state


#--API 视图--
class FeedingList(generics.ListCreateAPIView):
    queryset = Feeding.objects.all().order_by('-timestamp')
    serializer_class = FeedingSerializer
#--根路径视图--
def home(request):
    return JsonResponse({"message": "Welcome to the Feeding API"})

#--喂养数据接口--
@api_view(['GET'])
def feeding_stats(request):
    stats = Feeding.objects.aggregate(
        max = Max('activity_level'),
        min = Min('activity_level'),
        avg = Avg('activity_level'),
    )    
    return Response(stats)

#--报警接口--
@api_view(['GET'])
def feeding_alerts(request):
    last = Feeding.objects.order_by('-timestamp').first()
    if not last:
        return Response({"alerts": []})
    alerts = []
    if last.oxygen is not None and last.oxygen <5:
        alerts.append("Low oxygen detected (<5 mg/L)")
    if last.temperature is not None and last.temperature >30:
        alerts.append("High temperature too high (>30 °C)")
    if last.ph is not None and last.ph < 6.8:
        alerts.append("pH too low (<6.8)")
    
    return Response({"alerts": alerts})

#--模拟器控制接口--
@api_view(['POST'])
def start_simulator(request):
    if not state.SIMULATOR_RUNNING:
        state.start_simulator_thread()
    return Response({"running": True})

@api_view(['POST'])
def stop_simulator(request):
    state.SIMULATOR_RUNNING = False
    return Response({"running": False})

#--模拟器轮询接口--
@api_view(['GET'])
def simulator_status(request):
    return Response({"running": state.SIMULATOR_RUNNING})