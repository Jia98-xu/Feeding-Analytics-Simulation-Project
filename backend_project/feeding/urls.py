from django.urls import path
from .views import (
    FeedingList,
    home,
    feeding_stats,
    feeding_alerts,
    start_simulator,
    stop_simulator,
    simulator_status
)

urlpatterns = [
    #--根目录--
    path('', home),

    #--喂食数据接口--
    path('feedings/', FeedingList.as_view(), name='feeding-list'),
    path('feeding-stats/', feeding_stats, name='feeding-stats'),
    path('feeding-alerts/', feeding_alerts, name='feeding-alerts'),

    #--模拟器控制接口--
    path('feeding-simulator/start/', start_simulator, name='simulator-start'),
    path('feeding-simulator/stop/', stop_simulator, name='simulator-stop'),
    path('feeding-simulator/status/', simulator_status, name='simulator-status'),
]