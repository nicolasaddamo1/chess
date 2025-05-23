from django.urls import path
from . import views

urlpatterns = [
    path('', views.tournament_list_create, name='tournament_list_create'),
    path('<uuid:tournament_id>/', views.tournament_detail, name='tournament_detail'),
    path('<uuid:tournament_id>/join/', views.join_tournament, name='join_tournament'),
    path('<uuid:tournament_id>/leave/', views.leave_tournament, name='leave_tournament'),
    path('<uuid:tournament_id>/matches/', views.tournament_matches, name='tournament_matches'),
]