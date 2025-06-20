from django.urls import path
from .views import FitnessQueryView

urlpatterns = [
    path('query/', FitnessQueryView.as_view(), name='fitness-query'),
]